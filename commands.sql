CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7),
('Amman Mittal', 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project', 'How to configure ESLint and Prettier in an Expo project', 2);