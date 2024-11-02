'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Home,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { StoreCreateInput, StoreCurrency, StoreType } from '@/types/api';
import { useCurrentUser } from '@/common/hooks/auth';
import { useCreateStore } from '@/admin/hooks/store';
import { StoreAlreadyExists } from './(components)/store-already-exists';

type CurrencyOption = { code: StoreCurrency; description: string };

const currencies: Array<CurrencyOption> = [
  {
    code: StoreCurrency.Ugx,
    description: 'Ugandan Shilling (UGX)',
  },
];

interface StoreSetupContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  visibleSteps: number[];
  selectedCurrency: CurrencyOption;
  setVisibleSteps: React.Dispatch<React.SetStateAction<number[]>>;
  progress: number;
  storeData: StoreCreateInput;
  updateStoreData: (data: Partial<StoreSetupContextType['storeData']>) => void;
}

const StoreSetupContext = React.createContext<
  StoreSetupContextType | undefined
>(undefined);

const useStoreSetup = () => {
  const context = React.useContext(StoreSetupContext);
  if (!context) {
    throw new Error('useStoreSetup must be used within a StoreSetupProvider');
  }
  return context;
};

const StoreSetupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [visibleSteps, setVisibleSteps] = React.useState([0]);
  const [storeData, setStoreData] = React.useState({
    name: '',
    slug: '',
    type: StoreType.PhysicalGoods,
    currency: currencies[0].code,
  });

  const updateStoreData = React.useCallback(
    (data: Partial<typeof storeData>) => {
      setStoreData((prev) => {
        const newData = { ...prev, ...data };
        return JSON.stringify(newData) !== JSON.stringify(prev)
          ? newData
          : prev;
      });
    },
    []
  );

  const progress = ((currentStep + 1) / 4) * 100;

  const value = {
    currentStep,
    setCurrentStep,
    visibleSteps,
    setVisibleSteps,
    progress,
    storeData,
    updateStoreData,
    selectedCurrency: currencies[0],
  };

  return (
    <StoreSetupContext.Provider value={value}>
      {children}
    </StoreSetupContext.Provider>
  );
};

const StepWrapper: React.FC<{
  children: React.ReactNode;
  icon: string;
  title: string;
  stepIndex: number;
}> = ({ children, icon, title, stepIndex }) => {
  const { currentStep } = useStoreSetup();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (stepIndex === currentStep && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep, stepIndex]);

  const isCurrentStep = stepIndex === currentStep;

  return (
    <div
      ref={ref}
      className={`bg-card rounded-lg p-6 space-y-4 transition-opacity duration-300 ${
        isCurrentStep ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const StoreNameStep: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  const {
    storeData,
    updateStoreData,
    setCurrentStep,
    setVisibleSteps,
    currentStep,
  } = useStoreSetup();
  const [animationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    setAnimationComplete(false);
  }, [stepIndex]);

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStoreData({ name: e.target.value });
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    setVisibleSteps((prev) => [...new Set([...prev, stepIndex + 1])]);
  };

  return (
    <StepWrapper icon="🏪" title="Store Name" stepIndex={stepIndex}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          <TypeAnimation
            sequence={['Welcome to Your Store Setup!', 1000]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </h2>
        <p className="text-muted-foreground">
          <TypeAnimation
            sequence={[
              1000,
              "Let's start by giving your store a name. This will be the first thing your customers see.",
              1000,
              () => setAnimationComplete(true),
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationComplete ? 1 : 0,
            y: animationComplete ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeData.name}
              onChange={handleStoreNameChange}
              placeholder="Enter your store name"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleNext}
              disabled={!storeData.name || currentStep !== stepIndex}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </StepWrapper>
  );
};

const StoreHandleStep: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  const {
    storeData,
    updateStoreData,
    setCurrentStep,
    setVisibleSteps,
    currentStep,
  } = useStoreSetup();
  const [storeHandle, setStoreHandle] = React.useState(
    storeData.slug || storeData.name.toLowerCase().replace(/\s+/g, '-')
  );
  const [animationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    setAnimationComplete(false);
  }, [stepIndex]);

  React.useEffect(() => {
    if (storeData.slug !== storeHandle) {
      updateStoreData({ slug: storeHandle });
    }
  }, [storeHandle, updateStoreData, storeData.slug]);

  const handleStoreHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreHandle(e.target.value.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    setVisibleSteps((prev) => [...new Set([...prev, stepIndex + 1])]);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <StepWrapper icon="🔗" title="Store Handle" stepIndex={stepIndex}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          <TypeAnimation
            sequence={['Choose Your Store Handle', 1000]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </h2>
        <p className="text-muted-foreground">
          <TypeAnimation
            sequence={[
              1000,
              "Your store handle will be used in your store's URL.",
              1000,
              () => setAnimationComplete(true),
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationComplete ? 1 : 0,
            y: animationComplete ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="storeHandle">Store Handle</Label>
            <Input
              id="storeHandle"
              value={storeHandle}
              onChange={handleStoreHandleChange}
              placeholder="Enter your store handle"
            />
            <p className="text-sm text-muted-foreground">
              Your store will be available at: https://yourplatform.com/
              {storeHandle}
            </p>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!storeHandle || currentStep !== stepIndex}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </StepWrapper>
  );
};

const StoreTypeStep: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  const {
    storeData,
    updateStoreData,
    setCurrentStep,
    setVisibleSteps,
    currentStep,
  } = useStoreSetup();
  const [animationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    setAnimationComplete(false);
  }, [stepIndex]);

  const storeTypes: Array<{
    id: StoreType;
    label: string;
    icon: React.ElementType;
    disabled: boolean;
  }> = [
    {
      id: StoreType.PhysicalGoods,
      label: 'Physical Goods',
      icon: ShoppingBag,
      disabled: false,
    },
    {
      id: StoreType.RealEstate,
      label: 'Real Estate',
      icon: Home,
      disabled: true,
    },
    { id: StoreType.Vehicles, label: 'Vehicles', icon: Car, disabled: true },
  ];

  const handleSelectType = (type: StoreType) => {
    updateStoreData({ type });
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
    setVisibleSteps((prev) => [...new Set([...prev, stepIndex + 1])]);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <StepWrapper icon="📦" title="Store Type" stepIndex={stepIndex}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          <TypeAnimation
            sequence={[`What will ${storeData.name} offer?`, 1000]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </h2>
        <p className="text-muted-foreground">
          <TypeAnimation
            sequence={[
              1000,
              "Select the primary category of items you'll be selling. This helps us tailor your store experience.",
              1000,
              () => setAnimationComplete(true),
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationComplete ? 1 : 0,
            y: animationComplete ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            {storeTypes.map((type) => (
              <Button
                key={type.id}
                variant={storeData.type === type.id ? 'default' : 'outline'}
                className="h-auto py-4 px-6 flex items-center justify-start space-x-4"
                onClick={() => handleSelectType(type.id)}
                disabled={type.disabled || currentStep !== stepIndex}
              >
                <type.icon className="h-6 w-4" />
                <span>{type.label}</span>
                {type.disabled && (
                  <span className="ml-auto text-sm text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </Button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!storeData.type || currentStep !== stepIndex}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </StepWrapper>
  );
};

const StoreCurrencyStep: React.FC<{ stepIndex: number }> = ({ stepIndex }) => {
  const {
    storeData,
    updateStoreData,
    setCurrentStep,
    currentStep,
    selectedCurrency,
  } = useStoreSetup();
  const [animationComplete, setAnimationComplete] = React.useState(false);
  const { createStore, isLoading, isSuccessful } = useCreateStore();

  React.useEffect(() => {
    setAnimationComplete(false);
  }, [stepIndex]);

  React.useEffect(() => {
    if (isSuccessful) {
      window.location.href = '/dashboard';
    }
  }, [isSuccessful]);

  const handleCurrencyChange = (value: StoreCurrency) => {
    updateStoreData({ currency: value });
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    createStore(storeData);
  };

  return (
    <StepWrapper icon="💰" title="Store Currency" stepIndex={stepIndex}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          <TypeAnimation
            sequence={['Choose Your Store Currency', 1000]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </h2>
        <p className="text-muted-foreground">
          <TypeAnimation
            sequence={[
              1000,
              `Your store will use ${selectedCurrency.description} for all transactions.`,
              1000,
              () => setAnimationComplete(true),
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationComplete ? 1 : 0,
            y: animationComplete ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="storeCurrency">Store Currency</Label>
            <Select
              onValueChange={handleCurrencyChange}
              value={selectedCurrency.code}
              disabled={currencies.length < 2}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{selectedCurrency.description}</SelectValue>
              </SelectTrigger>
              {currencies.map((currency) => (
                <SelectContent key={currency.code}>
                  <SelectItem value={currency.code}>
                    {selectedCurrency.description}
                  </SelectItem>
                </SelectContent>
              ))}
            </Select>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleFinish}
              disabled={currentStep !== stepIndex || isLoading || isSuccessful}
              className={`transition-all duration-300 ${
                currentStep !== stepIndex ? 'invisible' : 'visible'
              }`}
            >
              {isLoading ? 'Loading...' : 'Finish'}
            </Button>
          </div>
        </motion.div>
      </div>
    </StepWrapper>
  );
};

const StoreSetupContent: React.FC = () => {
  const { visibleSteps } = useStoreSetup();

  const steps = [
    { id: 'storeName', component: StoreNameStep },
    { id: 'storeHandle', component: StoreHandleStep },
    { id: 'storeType', component: StoreTypeStep },
    { id: 'storeCurrency', component: StoreCurrencyStep },
  ];

  return (
    <div className="space-y-12 pb-12">
      {steps
        .filter((_, index) => visibleSteps.includes(index))
        .map((step, index) => (
          <step.component key={step.id} stepIndex={index} />
        ))}
    </div>
  );
};

const StoreSetupHeader: React.FC = () => {
  const { progress } = useStoreSetup();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <div className="w-full max-w-[calc(448px*1.1)] mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Store Setup</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default function StoreSetupWizard() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (!isLoading && user?.stores?.length) {
    return <StoreAlreadyExists />;
  }

  return (
    <StoreSetupProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-sm py-4 flex justify-center">
          <StoreSetupHeader />
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="w-full max-w-md mx-auto px-4 py-6">
            <StoreSetupContent />
          </div>
        </div>
      </div>
    </StoreSetupProvider>
  );
}
