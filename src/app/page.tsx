import Link from 'next/link';

export default function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
              <h1 className="display-4 mb-4">Hospital Management System</h1>
              <p className="lead mb-4">Welcome to our comprehensive hospital management platform</p>
              <Link href="/login" className="btn btn-primary btn-lg me-3">
                Login
              </Link>
              <Link href="/dashboard" className="btn btn-outline-primary btn-lg">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
