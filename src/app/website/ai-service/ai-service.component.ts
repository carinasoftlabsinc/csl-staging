import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

interface Capability {
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
  readonly star?: boolean;
}

interface Feature {
  readonly id: string;
  readonly title: string;
  readonly headline: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly cards: readonly Capability[];
}

@Component({
  selector: 'app-ai-service',
  standalone: false,
  templateUrl: './ai-service.component.html',
  styleUrls: ['./ai-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiServiceComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly assets = 'assets/images/ai-emerging-tech/';
  readonly serviceRows = [0, 1];
  readonly experienceCards = [0, 1, 2];
  readonly metrics = [
    { title: 'AI-Powered', description: 'Intelligent systems built around real use cases.' },
    { title: 'Game & Interactive Expertise', description: 'AI applied to games, simulations and immersive experiences.' },
    { title: 'Future-Ready Engineering', description: 'Scalable technology across Web, App, Cloud, XR and emerging platforms.' },
  ];
  readonly services: readonly Capability[] = [
    { title: 'AI Strategy & Consulting', description: 'Identify practical opportunities, roadmaps and adoption plans around business goals.' },
    { title: 'Generative AI Solutions', description: 'Enterprise copilots, knowledge systems, content tools and custom AI experiences.' },
    { title: 'AI Automation', description: 'Automate repetitive workflows, operational tasks and business processes.' },
    { title: 'AI-Powered Web & Apps', description: 'Smarter, more personalized websites, mobile apps and enterprise products.' },
    { title: 'Data, ML & Predictive Intelligence', description: 'Turn data into actionable insights with analytics, ML and predictive systems.' },
  ];
  readonly features: readonly Feature[] = [
    {
      id: 'games', title: 'AI Game Development', headline: 'Smarter Games.\nMore Dynamic Experiences.',
      description: 'With deep game development expertise, CSL explores how AI can make games more intelligent, adaptive and immersive—from NPC behavior to procedural worlds and personalized gameplay.',
      image: '9002-4874-Bg1.webp',
      imageAlt: 'Game developer building a fantasy game on two monitors next to a small AI robot',
      cards: [
        { title: 'Intelligent NPCs', description: 'NPCs that react to players, environments and game events.' },
        { title: 'Adaptive Gameplay', description: 'Challenges and difficulty calibrated to player behavior.' },
        { title: 'Procedural Content', description: 'AI-assisted environments, quests, dialogue and gameplay content.' },
        { title: 'AI Game Assistants', description: 'Conversational companions, guides and in-game characters.' },
        { title: 'Personalized Player Experiences', description: 'More relevant experiences informed by player data.' },
        { title: 'AI-Assisted Development', description: 'Accelerated prototyping, content workflows, testing and production.' },
      ],
    },
    {
      id: 'blockchain', title: 'AI • Blockchain • Games', headline: 'Intelligent Systems for\nPlayer-Owned Game Worlds',
      description: 'CSL combines game development and blockchain expertise to explore technical models for digital ownership, interactive assets and intelligent game economies.',
      image: '9030-1466-Bg2.webp',
      imageAlt: 'Gamer at a keyboard with holographic AI and blockchain panels, NFT cards and coins in a fantasy game world',
      cards: [
        { title: 'AI-Driven Game Assets', description: 'Dynamic behaviors and attributes for player-owned digital assets.', star: true },
        { title: 'Intelligent Game Economies', description: 'Data systems to analyze and balance complex game economies.', icon: '9030-1466-Group1000001990.svg' },
        { title: 'Dynamic NFT Experiences', description: 'Evolving asset interactions within product and game systems.', icon: '9030-1466-Frame1000002122.svg' },
        { title: 'AI + Web3 Game Infrastructure', description: 'Game logic, smart contracts, wallets, marketplaces and AI systems.', icon: '9030-1466-Frame1000002123.svg' },
      ],
    },
    {
      id: 'web', title: 'AI • Web • Services', headline: 'Intelligent Websites.\nSmarter Digital Products.',
      description: 'CSL combines web development and AI expertise to build fast, adaptive websites, web apps and intelligent platforms that understand users and grow with your business.',
      image: '9100-1442-Bg2.webp',
      imageAlt: 'Developer typing on a laptop while a holographic AI robot works on website analytics dashboards',
      cards: [
        { title: 'AI-Powered Web Apps', description: 'Smart search, recommendations and automation built directly into your web product.', icon: '9100-1442-Frame1000002122.svg' },
        { title: 'Adaptive Websites', description: 'Content and layouts that respond to visitor behaviour, intent and location.', icon: '9100-1442-Frame1000002124.svg' },
        { title: 'AI Chatbots & Assistants', description: '24/7 support bots trained on your business knowledge, FAQs and customer data.', icon: '9100-1442-Frame1000002123.svg' },
        { title: 'Web3 & Dapp Platforms', description: 'Wallet-connected interfaces, smart contract integration and secure on-chain experiences.', icon: '9100-1442-Frame1000002125.svg' },
      ],
    },
    {
      id: 'apps', title: 'AI • App • Development', headline: 'Smart Apps.\nBuilt for Real Users.',
      description: 'CSL designs and builds mobile and web apps powered by AI, from intelligent features and personalization to automation that makes every interaction feel effortless.',
      image: '9103-1529-Bg2.webp',
      imageAlt: 'Smartphone showing a friendly AI assistant robot surrounded by chat, settings, calendar and shopping icons',
      cards: [
        { title: 'AI-Native Mobile Apps', description: 'iOS and Android apps with smart features designed around how users actually behave.', icon: '9103-1529-Frame1000002122.svg' },
        { title: 'Personalized Experiences', description: "Onboarding, feeds and recommendations that adapt to each user's goals and habits.", icon: '9103-1529-Frame1000002124.svg' },
        { title: 'Workflow Automation', description: 'Automate repetitive tasks, document handling and data processing inside your app.', icon: '9103-1529-Frame1000002123.svg' },
        { title: 'Rapid MVP & Prototyping', description: 'From idea to a testable AI app in weeks, with feedback loops built in from day one.', icon: '9103-1529-Frame1000002125.svg' },
      ],
    },
  ];
  readonly starParts = [
    { file: 'Vector.svg', inset: '4.03% 10.59% 64.39% 51.2%' },
    { file: 'Vector1.svg', inset: '28.01% 67.13% 28.51% 7.86%' },
    { file: 'Vector2.svg', inset: '63.49% 52.13% 4.93% 10.19%' },
    { file: 'Vector3.svg', inset: '4.03% 52.14% 64.39% 9.75%' },
    { file: 'Vector4.svg', inset: '26.98% 30.42% 27.89% 29.48%' },
    { file: 'Vector5.svg', inset: '63.48% 11.11% 4.93% 51.2%' },
    { file: 'Vector6.svg', inset: '28.14% 8.81% 28.5% 66.18%' },
  ];
  readonly products = [
    { category: 'AI • Automation', title: 'Intelligent Business Automation', description: 'Workflows that reduce repetitive manual operations.' },
    { category: 'Gen AI • Product', title: 'AI-Powered Customer Experiences', description: 'Assistants, recommendations and personalized interactions.' },
    { category: 'Web • App • Cloud', title: 'AI-Powered Digital Products', description: 'Intelligence embedded in websites, apps and enterprise software.' },
    { category: 'XR • AI', title: 'AI + VR Training', description: 'Immersive training and simulation environments.' },
    { category: 'Vision • ML', title: 'Computer Vision', description: 'Intelligent image and video analysis for real operations.' },
    { category: 'AI • Unity', title: 'AI for Games', description: 'Intelligent NPCs, procedural systems and adaptive gameplay.' },
  ];
  readonly disciplines: readonly Capability[] = [
    { title: 'AI + VR\nTraining', description: 'Immersive training and simulation environments.' },
    { title: 'Game\nDevelopment', description: 'Games, interactive systems and real-time experiences.' },
    { title: 'Product\nEngineering', description: 'Web, mobile, cloud and scalable software.' },
    { title: 'Immersive\nTechnology', description: 'AR, VR, XR and spatial experiences.' },
    { title: 'Emerging\nTech', description: 'Blockchain, NFT games and new digital models.' },
  ];
  readonly connected = ['AI', 'Web + App', 'Game', 'XR', 'Blockchain'];
  readonly technologies: readonly Capability[] = [
    { title: 'AI & Machine Learning', description: 'OpenAI · Gemini · Claude · LangChain · TensorFlow · PyTorch · Python' },
    { title: 'Game Development', description: 'Unity · Unreal Engine · C# · C++' },
    { title: 'Web & App', description: 'React · Node.js · JavaScript · TypeScript · Mobile technologies' },
    { title: 'Cloud', description: 'AWS · Microsoft Azure · Google Cloud' },
    { title: 'XR', description: 'Meta Quest · AR · VR · Spatial Computing' },
    { title: 'Blockchain / Web3', description: 'Smart Contracts · Wallet Integration · NFT Infrastructure · Marketplace Integration' },
    { title: 'AI DEVELOPMENT', description: 'AWS · Microsoft Azure · Google Cloud' },
  ];
  readonly steps: readonly Capability[] = [
    { title: 'Discover', description: 'Understand the business problem, users and opportunity.' },
    { title: 'Strategize', description: 'Identify the right AI and emerging technology approach.' },
    { title: 'Prototype', description: 'Rapidly validate the idea before large-scale development.' },
    { title: 'Build', description: 'Develop, integrate, test and refine the solution.' },
    { title: 'Deploy & Scale', description: 'Launch, monitor, optimize and evolve the product.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'AI & Emerging Technology Services | Carina Softlabs',
      description: 'Build intelligent digital products with Carina Softlabs. Explore AI development, automation, AI-powered games, Web3, immersive experiences and smarter web and mobile apps.',
      url: 'https://carinasoftlabs.com/ai-emerging-technology',
      image: 'https://carinasoftlabs.com/assets/images/ai-emerging-tech/hero-HeroBg1.webp',
      imageAlt: 'AI and emerging technology at Carina Softlabs',
    });
  }
}
