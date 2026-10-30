import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { HeaderComponent } from '../header/header.component';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';
import { QuoteSectionComponent } from '../components/quote-section/quote-section.component';
import { FooterComponent } from '../footer/footer.component';

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
  templateUrl: './ai-service.component.html',
  styleUrls: ['./ai-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    GradientButtonComponent,
    QuoteSectionComponent,
    FooterComponent,
  ],
})
export class AiServiceComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly assets = 'assets/images/ai-emerging-tech/';
  readonly strategyCallLink = 'https://calendar.app.google/mezjQ2cpZyzbixNv6';
  readonly experienceCards = [
    {
      category: 'AI-Powered Applications',
      title: 'Automated Enterprise Document Parsing System',
      description: 'Developed an intelligent document processing pipeline that automated form extraction, cutting invoice handling time by 75% while increasing data accuracy.',
    },
    { category: 'AI-Powered Applications', title: 'Intelligent Digital Products and Automation', description: 'AI capabilities integrated directly into enterprise websites, apps and operations.' },
    { category: 'AI-Powered Applications', title: 'Intelligent Digital Products and Automation', description: 'AI capabilities integrated directly into enterprise websites, apps and operations.' },
  ];
  readonly metrics = [
    { title: 'Purpose-Driven AI', description: 'Custom machine learning and generative workflows built for real-world impact, not hype.' },
    { title: 'Interactive & Game Intelligence', description: 'Next-gen NPC behavior, procedural generation, and dynamic XR simulations.' },
    { title: 'Future-Proof Stack', description: 'Enterprise-grade code across Cloud, Web3/XR, Mobile, and Web platforms.' },
  ];
  readonly services: readonly Capability[] = [
    { title: 'AI Strategy & Consulting', description: 'Identify high-ROI use cases, assess data readiness, and map a clear execution roadmap designed around real business goals.' },
    { title: 'Generative AI Solutions', description: 'Enterprise copilots, custom content tools, and seamless generative AI integration into your existing products and workflows.' },
    { title: 'Workflow & Enterprise Automation', description: 'Our workflow automation services handle repetitive tasks, complex approvals, and business processes so your team can focus on higher-value work.' },
    { title: 'Intelligent Document Processing (IDP)', description: 'Automate document extraction from invoices, contracts, and forms with highly accurate, searchable results.' },
    { title: 'Model Evaluation & Monitoring', description: 'Systematic model evaluation, testing, and fine-tuning that keep your AI accurate, safe, and reliable post-launch.' },
    { title: 'AI-Powered Web & Mobile Apps', description: 'Build smarter, highly personalized websites, mobile apps, and enterprise software products that adapt to user behavior.' },
    { title: 'Data, ML & Predictive Intelligence', description: 'Transform raw data pipelines into actionable business intelligence through custom predictive models and recommendation engines.' },
    { title: 'Semantic Search Development', description: 'Upgrade traditional keyword search to context-aware discovery systems across complex enterprise knowledge bases.' },
    { title: 'Enterprise NLP & Language Models', description: 'Applied natural language processing for intelligent chatbots, automated summarization, sentiment analysis, and multilingual localization.' },
    { title: 'Computer Vision Systems', description: 'Real-time image and video analysis for automated quality control, object tracking, and operational visual monitoring.' },
  ];
  readonly features: readonly Feature[] = [
    {
      id: 'games', title: 'AI Game Development', headline: 'Smarter Games.\nMore Dynamic Experiences.',
      description: 'With deep game development expertise, we explore how AI can make games more intelligent, adaptive, and immersive—from NPC behavior and procedural worlds to personalized gameplay.',
      image: '9002-4874-Bg1.webp',
      imageAlt: 'AI game development: game developer building a fantasy game next to a small AI robot',
      cards: [
        { title: 'Intelligent NPCs', description: 'Non-player characters that react dynamically to player actions, environments, and game story events.' },
        { title: 'Adaptive Gameplay', description: 'Challenges and difficulty curves that adjust seamlessly to each player’s skill level and playing behavior.' },
        { title: 'Procedural Content', description: 'AI-assisted generation of environments, quests, dialogue trees, and gameplay assets.' },
        { title: 'AI Game Assistants', description: 'Conversational companions, lore guides, and in-game characters powered by custom language models.' },
        { title: 'Personalized Player Experiences', description: 'Tailored player journeys, rewards, and recommendations shaped directly by player data.' },
        { title: 'AI-Assisted Development', description: 'Accelerated prototyping, asset creation pipelines, automated QA testing, and production workflows.' },
      ],
    },
    {
      id: 'blockchain', title: 'AI • Blockchain • Games', headline: 'Intelligent Systems for\nPlayer-Owned Game Worlds',
      description: 'We combine game development and blockchain expertise to build new models for digital ownership, interactive assets, and intelligent game economies.',
      image: '9030-1466-Bg2.webp',
      imageAlt: 'Gamer at a keyboard with holographic AI and blockchain panels, NFT cards and coins in a fantasy game world',
      cards: [
        { title: 'AI-Driven Game Assets', description: 'Dynamic behaviors, attributes, and traits for player-owned digital assets.', star: true },
        { title: 'Intelligent Game Economies', description: 'Data systems that analyze, model, and balance complex in-game economies in real time.', icon: '9030-1466-Group1000001990.svg' },
        { title: 'Dynamic NFT Experiences', description: 'Assets that evolve dynamically through player achievements, game events, and marketplace activity.', icon: '9030-1466-Frame1000002122.svg' },
        { title: 'AI + Web3 Game Infrastructure', description: 'Game logic, smart contracts, non-custodial wallets, marketplaces, and AI systems working together seamlessly.', icon: '9030-1466-Frame1000002123.svg' },
      ],
    },
    {
      id: 'web', title: 'AI • Web • Services', headline: 'Intelligent Websites.\nSmarter Digital Products.',
      description: 'We combine web development and AI expertise to build fast, adaptive websites, web apps, and platforms that understand your users and grow with your business.',
      image: '9100-1442-Bg2.webp',
      imageAlt: 'Developer typing on a laptop while a holographic AI robot works on website analytics dashboards',
      cards: [
        { title: 'AI-Powered Web Apps', description: 'Semantic search, intelligent recommendations, and automated workflows built directly into your web product.', icon: '9100-1442-Frame1000002122.svg' },
        { title: 'Adaptive Websites', description: 'Dynamic content and layouts that automatically respond to each visitor’s behavior, search intent, and location.', icon: '9100-1442-Frame1000002124.svg' },
        { title: 'AI Chatbots & Assistants', description: '24/7 conversational support bots trained specifically on your enterprise knowledge, FAQs, and customer data.', icon: '9100-1442-Frame1000002123.svg' },
        { title: 'Web3 & dApp Platforms', description: 'Wallet-connected interfaces, custom smart contract integrations, and secure on-chain web experiences.', icon: '9100-1442-Frame1000002125.svg' },
      ],
    },
    {
      id: 'apps', title: 'AI • App • Development', headline: 'Smart Apps.\nBuilt for Real Users.',
      description: 'We design and build mobile and web apps powered by AI, from intelligent features and personalization to automation that makes every interaction feel effortless.',
      image: '9103-1529-Bg2.webp',
      imageAlt: 'Smartphone showing a friendly AI assistant robot surrounded by chat, settings, calendar and shopping icons',
      cards: [
        { title: 'AI-Native Mobile Apps', description: 'Feature-rich iOS and Android apps designed around how users actually behave in real scenarios.', icon: '9103-1529-Frame1000002122.svg' },
        { title: 'Personalized Experiences', description: 'Dynamic onboarding, personalized content feeds, and smart recommendations that adapt to user goals.', icon: '9103-1529-Frame1000002124.svg' },
        { title: 'In-App Workflow Automation', description: 'Automate repetitive mobile tasks, document extraction, and data processing inside your app.', icon: '9103-1529-Frame1000002123.svg' },
        { title: 'Rapid MVP & Prototyping', description: 'Go from initial concept to a testable AI app in weeks, with real user feedback loops built in from day one.', icon: '9103-1529-Frame1000002125.svg' },
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
    { category: 'AI • Automation', title: 'Intelligent Business Automation', description: 'Workflows that cut repetitive manual work and operational bottlenecks.' },
    { category: 'Gen AI • Product', title: 'AI-Powered Customer Experiences', description: 'Conversational assistants, tailored recommendations, and personalized user interactions.' },
    { category: 'Web • App • Cloud', title: 'AI-Powered Digital Products', description: 'Embedded intelligence across web platforms, mobile apps, and enterprise software.' },
    { category: 'XR • AI', title: 'AR/VR Training & Simulation', description: 'Immersive spatial computing and interactive environments for safer, faster training.' },
    { category: 'Vision • ML', title: 'Computer Vision Solutions', description: 'Intelligent image and video analysis for real-world operations.' },
    { category: 'AI • Unity', title: 'AI for Games', description: 'Intelligent NPCs, procedural generation engines, and adaptive gameplay frameworks.' },
  ];
  readonly disciplines: readonly Capability[] = [
    { title: 'AI + VR\nTraining', description: 'Immersive, physics-based training and simulation environments.' },
    { title: 'Game\nDevelopment', description: 'Full-cycle games, interactive real-time systems, and co-development.' },
    { title: 'Product\nEngineering', description: 'Enterprise web, mobile apps, cloud architecture, and scalable software.' },
    { title: 'Immersive\nTechnology', description: 'Spatial computing, mixed reality (MR), and AR/VR development.' },
    { title: 'Emerging\nTech', description: 'Blockchain, NFT games, web3 architecture, and modern digital models.' },
  ];
  readonly connected = ['AI', 'Web + App', 'Game', 'XR', 'Blockchain'];
  readonly technologies: readonly Capability[] = [
    { title: 'AI & Machine Learning', description: 'OpenAI · Gemini · Claude · LangChain · TensorFlow · PyTorch · Python' },
    { title: 'Game Development', description: 'Unity · Unreal Engine · C# · C++' },
    { title: 'Web & App', description: 'React · Node.js · JavaScript · TypeScript · Flutter · Native Mobile' },
    { title: 'Cloud Infrastructure', description: 'AWS · Microsoft Azure · Google Cloud Platform' },
    { title: 'XR & Spatial Computing', description: 'Meta Quest SDK · Apple visionOS · ARKit · ARCore' },
    { title: 'Blockchain / Web3', description: 'Smart Contracts · Wallet Integration · NFT Infrastructure · Marketplace Integration' },
  ];
  readonly steps: readonly Capability[] = [
    { title: 'Discover', description: 'Understand the business problem, target users, data infrastructure, and core opportunities.' },
    { title: 'Strategize', description: 'Select the right AI models, data architecture, and technology stack aligned with your goals.' },
    { title: 'Prototype', description: 'Build and validate functional proof-of-concepts (PoCs) quickly before committing to large-scale development.' },
    { title: 'Build', description: 'Full-stack development, system integration, automated testing, and rigorous model evaluation for accuracy, security, and safety.' },
    { title: 'Deploy & Scale', description: 'Launch into production, monitor performance, optimize response times, and continuously evolve the product.' },
  ];

  scrollToSection(event: MouseEvent, id: string): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }

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
