export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm border-t border-gray-800">
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} Q-LAB Store. All rights reserved.</p>
            </div>
        </footer>
    );
}