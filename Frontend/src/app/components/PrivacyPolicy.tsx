export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B1220] py-12 px-6">
      <div className="max-w-[900px] mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-white text-5xl mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg mb-6">
            This Privacy Policy explains what information ALTM collects and how it is used.
          </p>
          <div className="h-px bg-gradient-to-r from-blue-500/50 via-blue-400/30 to-transparent"></div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {/* Information We Collect */}
          <section className="bg-[#141B2E] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-white text-2xl mb-4">1. Information We Collect</h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              <p>
                ALTM only processes log files that users voluntarily upload for analysis.
              </p>
              <p>
                The information collected is limited to the contents of the uploaded log files, which may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>System event records</li>
                <li>Process names</li>
                <li>Command-line data</li>
                <li>Parent process relationships</li>
                <li>Timestamps</li>
                <li>System-generated technical details</li>
              </ul>
              <p>
                We do not collect any additional personal information outside of what is contained within the uploaded logs.
              </p>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-[#141B2E] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-white text-2xl mb-4">2. How We Use the Information</h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              <p>
                The uploaded log data is used solely for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Log analysis</li>
                <li>Threat detection</li>
                <li>Security review within the tool</li>
              </ul>
              <p>
                The data is not used for advertising, profiling, or marketing.
              </p>
            </div>
          </section>

          {/* Data Storage & Retention */}
          <section className="bg-[#141B2E] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-white text-2xl mb-4">3. Data Storage</h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              <p>
                Log data is processed within the active session.
              </p>
              <p>
                Unless otherwise configured, uploaded logs are not permanently stored.
              </p>
              <p>
                Users are responsible for the data they upload into the system.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-[#141B2E] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-white text-2xl mb-4">4. Data Security</h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              <p>
                Reasonable technical safeguards are applied to protect data during processing.
              </p>
              <p>
                Users should ensure that log files uploaded to the platform are authorized for analysis.
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="bg-[#141B2E] rounded-2xl p-8 border border-gray-800/50">
            <h2 className="text-white text-2xl mb-4">5. Changes to This Policy</h2>
            <div className="space-y-3 text-gray-400 leading-relaxed">
              <p>
                This Privacy Policy may be updated if the system functionality changes.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <p className="text-gray-400 text-center mb-2">
            ALTM – Automated Log Threat Mapper
          </p>
          <p className="text-gray-500 text-sm text-center">
            Log analysis performed on user-provided data only.
          </p>
        </div>
      </div>
    </div>
  );
}