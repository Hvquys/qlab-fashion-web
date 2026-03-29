import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans antialiased">
            <Header />
            <main className="flex-grow bg-white">
                <Outlet /> {/* HomeScreen hoặc các trang khác sẽ nhảy vào đây */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;