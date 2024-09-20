const migrate = async () => {
    try {
        await import('./database/migrations/0000clearTableMigration').then(module => module.default());
        console.log('-- Migrate execute');
        await import('./database/migrations/0001createRolesTable').then(module => module.default());
        await import('./database/migrations/0003createUsersTable').then(module => module.default());

        console.log('-- Seeder execute');
        await import('./database/seeders/roleSeeder').then(module => module.default());
        await import('./database/seeders/userSeeder').then(module => module.default());
        return;
    } catch (err) {
        console.error('Error during migrations:', err);
    } finally {
        console.log('Database connection closed');
        process.exit(0);
    }
};

migrate();