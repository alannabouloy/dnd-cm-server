module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/dnd-campaign-manager',
    JWT_SECRET: process.env.JWT_SECRET || 'roll-insight-nat20-get-whispers',
}