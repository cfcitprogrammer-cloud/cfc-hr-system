export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <img
          src="https://jdudykmsleefptjgostd.supabase.co/storage/v1/object/public/assets/cfc-logo-removebg.png"
          alt="cfc-logo"
          width={120}
          height={120}
          className="mx-auto"
        />

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Thank You!
        </h1>

        <p className="text-gray-600 mb-6">
          Your submission has been successfully submitted.
        </p>

        <p className="text-sm text-gray-500">You may now close this page.</p>
      </div>
    </div>
  );
}
