import { CERTIFICATIONS } from "../constants/index";

const Certifications = () => (
  <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-10">Certifications</h2>
    <div className="flex flex-wrap gap-6">
      {CERTIFICATIONS.map((cert) => (
        <a
          key={cert.name}
          href={cert.badgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all bg-white group"
        >
          <img
            src={cert.badgeImg}
            alt={cert.name}
            className="w-16 h-16 object-contain"
          />
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-black text-sm">
              {cert.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>
            <p className="text-xs text-gray-400 mt-0.5">Issued {cert.issued}</p>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default Certifications;
