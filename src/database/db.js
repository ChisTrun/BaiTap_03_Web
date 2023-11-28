const { query } = require('express');
const data = require('../../data/data.json')

const pgp = require('pg-promise')({ capSQL: true });
require('dotenv').config();

const connectionInfo = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.MY_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
}
const db = pgp(connectionInfo);
const dbCheck = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
});

const execute = async (sql, param) => {
    let dbcn = null;
    try {
        dbcn = await db.connect();
        const data = await dbcn.query(sql, param);
        return data;
    } catch (error) {
        throw error;
    } finally {
        if (dbcn) {
            dbcn.done();
        }
    }
}

const createDB = async (dbName, user, newPassword) => {
    const sqlChange = `ALTER USER ${user} PASSWORD '${newPassword}'`;
    await dbCheck.none(sqlChange);
    const sqlCheck = "SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)";
    const data = await dbCheck.any(sqlCheck, [dbName]);
    if (data.length === 0) {
        const sqlCreate = `CREATE DATABASE ${dbName}`;
        await dbCheck.none(sqlCreate);
        return true;
    }
    return false;
}

const createTable = async () => {
    await execute(`
    CREATE TABLE IF NOT EXISTS images (
        id TEXT ,
        title TEXT,
        image TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS movies (
        id TEXT ,
        title TEXT,
        originalTitle TEXT,
        fullTitle TEXT,
        year TEXT,
        image TEXT,
        releaseDate TEXT,
        runtimeStr TEXT,
        plot TEXT,
        awards TEXT,
        companies TEXT,
        countries TEXT,
        languages TEXT,
        imDbRating double precision,
        boxOffice TEXT,
        plotFull TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS names (
        id TEXT ,
        name TEXT,
        role TEXT,
        image TEXT,
        summary TEXT,
        birthDate DATE,
        deathDate DATE,
        awards TEXT,
        height TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS reviews (
        movieId TEXT,
        username TEXT,
        warningSpoilers BOOLEAN,
        date DATE,
        rate TEXT,
        title TEXT,
        content TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS directors (
        movieId TEXT,
        namesId TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS writers (
        movieId TEXT,
        namesId TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS actors (
        movieId TEXT,
        namesId TEXT,
        asCharacter TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS genreList (
        movieId TEXT,
        type TEXT
    )`);
    //done
    await execute(`
    CREATE TABLE IF NOT EXISTS fav (
        movieId TEXT
    )`);
    //doone
    await execute(`
    CREATE TABLE IF NOT EXISTS castMovies (
        namesId TEXT,
        movieid TEXT,
        ROLE TEXT
    )`);
}

const insertDta = async () => {
    for (const key in data) {
        if (key == 'Movies') {
            for (const movie of data[key]) {
                const sqlIns = `
                    INSERT INTO movies(id, title, originalTitle, fullTitle, year, image, releaseDate, runtimeStr, plot, awards, companies, countries, languages, imDbRating, boxOffice, plotFull)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                `;
                const imDbRating = movie.imDbRating === undefined || movie.imDbRating === null || movie.imDbRating === '' ? 0 : parseFloat(movie.imDbRating);
                const values = [movie.id, movie.title, movie.originalTitle, movie.fullTitle, movie.year, movie.image, movie.releaseDate, movie.runtimeStr, movie.plot, movie.awards, movie.companies, movie.countries, movie.languages, imDbRating, movie.boxOffice, movie.plotFull];
                await execute(sqlIns, values);
                for (const image of movie.images) {
                    const sqlIns = `
                        INSERT INTO images(id, title, image )
                        VALUES($1, $2, $3)
                    `
                    const values = [movie.id, image.title, image.image]
                    await execute(sqlIns, values);
                }
                for (const director of movie.directorList) {
                    const sqlIns = `
                        INSERT INTO directors(movieId, namesId )
                        VALUES($1, $2)
                    `
                    const values = [movie.id, director]
                    await execute(sqlIns, values);
                }
                for (const writer of movie.writerList) {
                    const sqlIns = `
                        INSERT INTO writers(movieId, namesId )
                        VALUES($1, $2)
                    `
                    const values = [movie.id, writer];
                    await execute(sqlIns, values);
                }
                for (const actor of movie.actorList) {
                    const sqlIns = `
                        INSERT INTO actors(movieId, namesId ,asCharacter)
                        VALUES($1, $2, $3)
                    `
                    const values = [movie.id, actor.id, actor.asCharacter];
                    await execute(sqlIns, values);
                }
                for (const type of movie.genreList) {
                    const sqlIns = `
                        INSERT INTO genreList(movieId, type )
                        VALUES($1, $2)
                    `
                    const values = [movie.id, type];
                    await execute(sqlIns, values);
                }
            }
        } else if (key == 'Names') {
            for (const name of data[key]) {
                const sql = `
                    INSERT INTO names(id, name, role, image, summary, birthDate, deathDate, awards, height)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `;
                const values = [name.id, name.name, name.role, name.image, name.summary, name.birthDate, name.deathDate, name.awards, name.height];
                await execute(sql, values);
                if (name.images && Array.isArray(name.images)) {
                    for (let image of name.images) {
                        const sqlIns = `
                            INSERT INTO images(id, title, image )
                            VALUES($1, $2, $3)
                        `
                        const values = [name.id, image.title, image.image]
                        await execute(sqlIns, values);
                    }
                }
                if (name.castMovies && Array.isArray(name.castMovies)) {
                    for (let movie of name.castMovies) {
                        const sqlIns = `
                            INSERT INTO castMovies(namesId , movieid , ROLE )
                            VALUES($1, $2, $3)
                        `
                        const values = [name.id, movie.id, movie.role]
                        await execute(sqlIns, values);
                    }
                }
            }
        } else if (key == 'Reviews') {
            for (const review of data[key]) {
                for (const item of review.items) {
                    const sqlIns = `
                            INSERT INTO reviews(movieId, username, warningSpoilers, date, rate, title, content)
                            VALUES($1, $2, $3, $4, $5, $6, $7)
                    `;
                    const values = [review.movieId, item.username, item.warningSpoilers, item.date, item.rate, item.title, item.content];
                    await execute(sqlIns, values);
                }
            }
        }
    }
}

const initDB = async (dbName, user, newPassword) => {
    try {
        let createNewDB = await createDB(dbName, user, newPassword).catch(console.error);
        if (createNewDB) {
            await createTable()
            await insertDta();
        }
    } catch (error) {
        throw error;
    };

}

initDB(process.env.MY_DB, process.env.DB_USER, process.env.DB_PW)

module.exports = {
    execute: async (sql, param) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.query(sql, param);
            return data;
        } catch (error) {
            throw error;
        } finally {
            if (dbcn) {
                dbcn.done();
            }
        }
    }
}