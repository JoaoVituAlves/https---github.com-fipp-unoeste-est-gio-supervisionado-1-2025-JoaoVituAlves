export default function Footer() {
    return (
        <footer className="sticky-footer bg-white mt-auto">
            <div className="container my-auto">
                <div className="text-center my-auto">
                    <span>Copyright &copy; 
                        Dumed Hospitalar {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </footer>
    )
}