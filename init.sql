DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id integer,
    username varchar NOT NULL,
    password varchar NOT NULL,
    loginCount integer default 0,
    create_todo_count integer default 0,
    complete_todo_count integer default 0,
    translate_todo_count integer default 0,
    roles varchar[],
    primary key (id)
);


DROP TABLE IF EXISTS todos;
CREATE TABLE todos (
    id integer,
    user_id integer references users(id) NOT NULL,
    title varchar NOT NULL,
    completed boolean default FALSE,
    primary key (id)
);


DROP TABLE IF EXISTS admins ;




