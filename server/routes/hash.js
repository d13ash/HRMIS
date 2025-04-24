const bcrypt = require('bcryptjs');

async function run() {
    const salt = await bcrypt.genSalt(10);

    console.log(salt);
    const hashed = await bcrypt.hash('mis@123', salt);


    console.log(hashed);
}
run();