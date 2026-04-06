import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}