import bcrypt from 'bcrypt';

const run = async () => {
    const password = 'SAdmin@1234';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
};

run();
