const migrate = async () => {
    try {
        await import('./database/migrations/0000clearTableMigration').then(module => module.default());
        console.log('-- Migrate execute');
        await import('./database/migrations/0001createRolesTable').then(module => module.default());
        await import('./database/migrations/0001createPermissionTable').then(module => module.default());
        await import('./database/migrations/0002createRolePermissionTable').then(module => module.default());
        await import('./database/migrations/0003createUsersTable').then(module => module.default());
        await import('./database/migrations/0005createRefTaxTable').then(module => module.default());
        await import('./database/migrations/0006createRefSubTaxTable').then(module => module.default());
        await import('./database/migrations/0008createRefRegionTable').then(module => module.default());
        await import('./database/migrations/0009createRegionsTable').then(module => module.default());
        await import('./database/migrations/0011createDepositTable').then(module => module.default());

        console.log('-- Seeder execute');
        await import('./database/seeders/roleSeeder').then(module => module.default());
        await import('./database/seeders/userSeeder').then(module => module.default());
        await import('./database/seeders/refTaxSeeder').then(module => module.default());
        await import('./database/seeders/regionSeeder').then(module => module.default());
        await import('./database/seeders/depositSeeder').then(module => module.default());
        return;
    } catch (err) {
        console.error('Error during migrations:', err);
    } finally {
        console.log('Database connection closed');
        process.exit(0);
    }
};

migrate();