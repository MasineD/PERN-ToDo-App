import {Pool} from "pg"     //This manages connections to the database

const pool = new Pool({     //Connecting to the database
    user: "postgres",
    password: "DonaldM@07",
    port: 5433,
    database: "Pern_ToDoDB"
});

export default pool;