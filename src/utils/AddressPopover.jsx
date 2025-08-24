export default function AddressPopover({ isOpen, onClose, values }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop com blur */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Popover principal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
        <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 w-80 max-w-sm mx-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Endereço Encontrado
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100/60 hover:bg-gray-200/60 flex items-center justify-center transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Conteúdo */}
          <div className="space-y-3">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-sm text-gray-600 font-medium">Logradouro</p>
              <p className="text-gray-800 font-semibold">
                {values.street || "Não informado"}
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-sm text-gray-600 font-medium">Bairro</p>
              <p className="text-gray-800 font-semibold">
                {values.neighborhood || "Não informado"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-sm text-gray-600 font-medium">Cidade</p>
                <p className="text-gray-800 font-semibold text-sm">
                  {values.city || "Não informado"}
                </p>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-sm text-gray-600 font-medium">Estado</p>
                <p className="text-gray-800 font-semibold text-sm">
                  {values.state || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
