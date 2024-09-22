import app from './app';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import regionRoutes from './routes/regionRoutes';
import refRoutes from './routes/refRoutes';
import roleRoutes from './routes/roleRoutes';
import refTaxRoutes from './routes/refTaxRoutes';
import refSubTaxRoutes from './routes/refSubTaxRoutes';
import depositRoutes from './routes/depositRoutes';

dotenv.config();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://localhost:4200'  // Atau '*' jika ingin mengizinkan semua origin
}));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/ref', refRoutes);
app.use('/role', roleRoutes);
app.use('/region', regionRoutes);
app.use('/manage-ref-tax', refTaxRoutes);
app.use('/manage-ref-sub-tax', refSubTaxRoutes);
app.use('/deposit', depositRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});