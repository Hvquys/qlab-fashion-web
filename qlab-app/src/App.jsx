import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomeScreen from './screens/HomeScreen';

function App() {
    return (
        <Router>
            <Routes>
                {/* Bọc tất cả trong MainLayout để luôn có Header/Footer */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomeScreen />} />
                    {/* Sau này thêm trang danh sách: <Route path="shop" element={<ShopScreen />} /> */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;