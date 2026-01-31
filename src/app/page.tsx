import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Mic, Globe, FileDown, FastForward, Lock, UploadCloud, Languages, BotMessageSquare, Download } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Mic,
    title: 'AI Voice Recognition',
    description: 'Accurate transcription using state-of-the-art speech-to-text AI.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Translate your content into a wide variety of languages.',
  },
  {
    icon: FileDown,
    title: 'PDF Download',
    description: 'Get a downloadable PDF of your translated text for easy sharing.',
  },
  {
    icon: FastForward,
    title: 'Fast Processing',
    description: 'Our optimized pipeline ensures you get your results quickly.',
  },
  {
    icon: Lock,
    title: 'Secure Upload',
    description: 'Your files are handled securely and deleted after processing.',
  },
];

const howItWorksSteps = [
    {
        icon: UploadCloud,
        title: "Upload Video",
        description: "Drag and drop or browse to upload your video file."
    },
    {
        icon: Languages,
        title: "Choose Language",
        description: "Select your desired target language and voice style."
    },
    {
        icon: BotMessageSquare,
        title: "AI Processes",
        description: "Our AI pipeline transcribes, translates, and generates audio."
    },
    {
        icon: Download,
        title: "Download Results",
        description: "Get your translated video, audio, and a PDF transcript."
    }
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 text-primary">
              Translate Any Video into Any Language
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload → Translate → Download PDF & Translated Audio
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
              <Link href="/translate">👉 Start Translating</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Powerful Features, Simple Interface
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary text-primary-foreground rounded-full">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {howItWorksSteps.map((step, index) => (
                    <div key={step.title} className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center h-16 w-16 bg-background rounded-full border-2 border-primary text-primary relative z-10">
                                <step.icon className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                ))}
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
