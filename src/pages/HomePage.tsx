import React, { useState, useMemo } from 'react';
import { Space, DigitalContract } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { SpaceCard } from '../components/SpaceCard.tsx';
import { SpaceFilters } from '../components/SpaceFilters.tsx';
import { BookingModal } from '../components/BookingModal.tsx';
import { ContractModal } from '../components/ContractModal.tsx';
import {
  Sparkles,
  ShieldCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  FileText,
  BadgePercent,
  Compass,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface HomePageProps {
  onOpenOwnerUpgrade: () => void;
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register', notice?: string) => void;
  onSelectSpace?: (space: Space) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenOwnerUpgrade,
  onNavigate,
  onOpenAuth,
  onSelectSpace,
}) => {
  const { spaces, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'abierto' | 'cerrado'>('all');
  const [selectedRateModality, setSelectedRateModality] = useState<'all' | 'hour' | 'day' | 'month'>('all');
  const [selectedCommune, setSelectedCommune] = useState('Todas las comunas');
  const [minSurfaceM2, setMinSurfaceM2] = useState(10);

  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [createdContract, setCreatedContract] = useState<DigitalContract | null>(null);
  const [isContractOpen, setIsContractOpen] = useState(false);

  // Filtro de espacios
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      // Solo mostrar espacios activos en el catálogo público
      if (space.status !== 'active') return false;

      // Filtro por término de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = space.title.toLowerCase().includes(term);
        const matchesAddress = space.address.toLowerCase().includes(term);
        const matchesCommune = space.commune.toLowerCase().includes(term);
        const matchesAmenities = space.amenities.some((a) => a.toLowerCase().includes(term));
        if (!matchesTitle && !matchesAddress && !matchesCommune && !matchesAmenities) {
          return false;
        }
      }

      // Filtro por categoría
      if (selectedCategory !== 'all' && space.category !== selectedCategory) {
        return false;
      }

      // Filtro por entorno: abierto vs cerrado
      if (selectedEnvironment !== 'all' && space.spaceEnvironment !== selectedEnvironment) {
        return false;
      }

      // Filtro por comuna
      if (selectedCommune !== 'Todas las comunas' && space.commune !== selectedCommune) {
        return false;
      }

      // Filtro por modalidad de arriendo (Por Hora, Por Día, Por Mes)
      const spaceRateUnit = space.priceUnit || (space.rentalModality === 'por_hora' ? 'hour' : space.rentalModality === 'mensual' ? 'month' : 'day');
      if (selectedRateModality !== 'all' && spaceRateUnit !== selectedRateModality) {
        return false;
      }

      // Filtro por m2
      if (space.surfaceM2 < minSurfaceM2) {
        return false;
      }

      return true;
    });
  }, [spaces, searchTerm, selectedCategory, selectedEnvironment, selectedRateModality, selectedCommune, minSurfaceM2]);

  const handleSelectSpace = (space: Space) => {
    setSelectedSpace(space);
    if (onSelectSpace) {
      onSelectSpace(space);
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleBookingSuccess = (contract: DigitalContract) => {
    setCreatedContract(contract);
    setIsContractOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedEnvironment('all');
    setSelectedRateModality('all');
    setSelectedCommune('Todas las comunas');
    setMinSurfaceM2(10);
  };

  const featureCards = [
    {
      icon: ShieldCheck,
      title: 'Verificación real',
      text: 'RUT, identidad y validación de seguridad para cada espacio y operación.',
    },
    {
      icon: FileText,
      title: 'Contratos digitales',
      text: 'Documentación clara y segura bajo la normativa chilena en minutos.',
    },
    {
      icon: BadgePercent,
      title: 'Flexibilidad de pago',
      text: 'Arriendo por hora, día o mes con condiciones alineadas a tus necesidades.',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            Mercado Corporativo y Creativo en Chile • Pesos Chilenos (CLP)
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Encuentra y arrienda el espacio ideal para tu negocio en Chile
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Oficinas privadas, salas para eventos, coworkings y estudios audiovisuales en Las Condes, Providencia, Santiago Centro y regiones. Suscribe contratos digitales en minutos con respaldo legal chileno.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Contratos bajo Ley N° 18.101
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verificación de Cédula y RUT
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Depósitos en Garantía Custodiados
            </span>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none"></div>
      </section>

      {/* Barra de Filtros */}
      <SpaceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
        selectedRateModality={selectedRateModality}
        onRateModalityChange={setSelectedRateModality}
        selectedCommune={selectedCommune}
        onCommuneChange={setSelectedCommune}
        minSurfaceM2={minSurfaceM2}
        onMinSurfaceChange={setMinSurfaceM2}
        onReset={handleResetFilters}
      />

      {/* Conteo de Resultados */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-slate-500">
          Mostrando <span className="text-slate-900 font-bold">{filteredSpaces.length}</span> espacios disponibles en Chile
        </p>
      </div>

      {/* Grid de Espacios */}
      {filteredSpaces.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No encontramos espacios con esos filtros</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prueba ajustando el rango de precio en CLP, seleccionando otra comuna o limpiando el término de búsqueda.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} onSelect={handleSelectSpace} />
          ))}
        </div>
      )}

      {/* Modal de Reserva */}
      <BookingModal
        space={selectedSpace}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
        onOpenAuth={onOpenAuth}
      />

      {/* Modal de Visualización de Contrato Digital */}
      <ContractModal
        contract={createdContract}
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
      />
    </div>
  );
};
