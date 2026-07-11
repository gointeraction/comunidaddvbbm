'use client';

import { useState, useMemo } from 'react';
import { Check, User, Sparkles, BarChart3, FileText } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import type { Interest, ExperienceLevel } from '@/types/autodev';

// ── Constants ──────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Nombre', icon: User },
  { n: 2, label: 'Intereses', icon: Sparkles },
  { n: 3, label: 'Nivel', icon: BarChart3 },
  { n: 4, label: 'Presentación', icon: FileText },
];

const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: 'automatizacion', label: 'Automatización' },
  { value: 'ia', label: 'IA' },
  { value: 'webapps', label: 'WebApps' },
  { value: 'comunidad', label: 'Comunidad' },
];

const LEVEL_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  {
    value: 'principiante',
    label: 'Principiante',
    description: 'Estoy empezando en el mundo del desarrollo y la automatización.',
  },
  {
    value: 'intermedio',
    label: 'Intermedio',
    description: 'Tengo experiencia trabajando con APIs, bases de datos y herramientas dev.',
  },
  {
    value: 'avanzado',
    label: 'Avanzado',
    description: 'Soy senior/lead. Domino arquitecturas complejas y quiero compartir conocimiento.',
  },
];

// ── Step 1: Display Name ───────────────────────────────
function StepName({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 terminal-text mb-1">
          ¿Cómo te llamas?
        </h2>
        <p className="text-sm text-gray-400 terminal-text">
          Este será tu nombre público en la comunidad.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="display-name" className="terminal-text text-sm text-gray-500">
          Nombre público
        </Label>
        <Input
          id="display-name"
          placeholder="ej: Carlos Dev"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
          autoFocus
        />
        {error && (
          <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {error}</p>
        )}
      </div>
    </div>
  );
}

// ── Step 2: Interests ──────────────────────────────────
function StepInterests({
  selected,
  onToggle,
  error,
}: {
  selected: Interest[];
  onToggle: (interest: Interest) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 terminal-text mb-1">
          ¿Qué te interesa?
        </h2>
        <p className="text-sm text-gray-400 terminal-text">
          Selecciona al menos una área de interés.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {INTEREST_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg border terminal-text text-sm
                transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                    : 'border-white/10 bg-[#030712] text-gray-400 hover:border-[#10B981]/40 hover:text-gray-100'
                }
              `}
            >
              {isSelected && <Check className="w-4 h-4" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {error}</p>
      )}
    </div>
  );
}

// ── Step 3: Experience Level ───────────────────────────
function StepLevel({
  selected,
  onSelect,
  error,
}: {
  selected: ExperienceLevel | null;
  onSelect: (level: ExperienceLevel) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 terminal-text mb-1">
          ¿Cuál es tu nivel?
        </h2>
        <p className="text-sm text-gray-400 terminal-text">
          Nos ayuda a personalizar tu experiencia.
        </p>
      </div>
      <div className="space-y-3">
        {LEVEL_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : 'border-white/10 bg-[#030712] hover:border-[#10B981]/40'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-[#10B981]' : 'border-gray-600'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#10B981]" />}
                </div>
                <span className="terminal-text font-semibold text-gray-100">{opt.label}</span>
              </div>
              <p className="text-sm text-gray-400 terminal-text mt-2 ml-7">{opt.description}</p>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {error}</p>
      )}
    </div>
  );
}

// ── Step 4: Bio ────────────────────────────────────────
function StepBio({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-semibold text-gray-100 terminal-text mb-1">
          Cuéntanos sobre ti
        </h2>
        <p className="text-sm text-gray-400 terminal-text">
          Una breve presentación para tu perfil.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" className="terminal-text text-sm text-gray-500">
          Biografía
        </Label>
        <Textarea
          id="bio"
          placeholder="Soy developer apasionado por..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981] min-h-[120px] resize-none"
          rows={5}
        />
        <div className="flex justify-between items-center">
          {error && (
            <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {error}</p>
          )}
          <span
            className={`text-xs terminal-text ml-auto ${
              value.length >= 20 ? 'text-[#10B981]' : 'text-gray-500'
            }`}
          >
            {value.length}/20 caracteres mínimos
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding Wizard ──────────────────────────────────
export default function OnboardingWizard() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [level, setLevel] = useState<ExperienceLevel | null>(null);
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const toggleInterest = (interest: Interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validateStep = (): boolean => {
    const newErrors: Record<number, string | null> = {};

    switch (step) {
      case 1:
        if (displayName.trim().length < 2) {
          newErrors[1] = 'Mínimo 2 caracteres';
        }
        break;
      case 2:
        if (interests.length < 1) {
          newErrors[2] = 'Selecciona al menos un interés';
        }
        break;
      case 3:
        if (!level) {
          newErrors[3] = 'Selecciona un nivel de experiencia';
        }
        break;
      case 4:
        if (bio.trim().length < 20) {
          newErrors[4] = 'Mínimo 20 caracteres';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep(step + 1);
      setErrors({});
    } else {
      completeOnboarding({
        displayName: displayName.trim(),
        interests,
        level: level!,
        bio: bio.trim(),
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const stepLabels = ['Nombre', 'Intereses', 'Nivel', 'Presentación'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] grid-bg px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Terminal Header */}
        <div className="terminal-text text-sm mb-6">
          <span className="text-[#10B981]">bbmdev</span>{' '}
          <span className="text-[#34D399]">~/onboarding/paso-{step}</span>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl shadow-2xl shadow-black/60 p-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.n;
              const isCompleted = step > s.n;
              return (
                <div key={s.n} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors
                      ${
                        isCompleted
                          ? 'border-[#10B981] bg-[#10B981]/10'
                          : isActive
                            ? 'border-[#10B981] bg-[#10B981]/10'
                            : 'border-white/10 bg-[#030712]'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <span
                    className={`text-[10px] terminal-text hidden sm:block ${
                      isActive ? 'text-[#10B981]' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-1.5 mb-8 bg-white/10" />

          {/* Step Content */}
          <div className="min-h-[220px]">
            {step === 1 && (
              <StepName
                value={displayName}
                onChange={setDisplayName}
                error={errors[1] ?? null}
              />
            )}
            {step === 2 && (
              <StepInterests
                selected={interests}
                onToggle={toggleInterest}
                error={errors[2] ?? null}
              />
            )}
            {step === 3 && (
              <StepLevel
                selected={level}
                onSelect={setLevel}
                error={errors[3] ?? null}
              />
            )}
            {step === 4 && (
              <StepBio
                value={bio}
                onChange={setBio}
                error={errors[4] ?? null}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="terminal-text text-gray-500 hover:text-gray-100 cursor-pointer"
            >
              ← Atrás
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              {step === 4 ? 'Completar' : 'Siguiente'} →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}