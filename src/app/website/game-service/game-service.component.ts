import { Component, ChangeDetectionStrategy, ElementRef, OnInit, afterNextRender, inject, viewChild } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-game-service',
  templateUrl: './game-service.component.html',
  styleUrls: ['./game-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GameServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly heroVideo = viewChild<ElementRef<HTMLVideoElement>>('heroVideo');

  constructor() {
    // Request playback after browser hydration, with the muted property applied.
    afterNextRender(() => {
      const video = this.heroVideo()?.nativeElement;
      if (!video) return;

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      // A browser can still decline autoplay; the poster remains visible then.
      void video.play().catch(() => {});
    });
  }

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Game Development Services | 2D, 3D, AR & VR | Carina Softlabs',
      description: 'Expert 2D & 3D game development services, Unreal Engine games, and game design services. Trusted Android & mobile game development company.',
      url: 'https://carinasoftlabs.com/game-development',
    });
  }

  scrollToQuote(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;

    const form = document.getElementById('lead-form');
    if (!form) return;

    event.preventDefault();
    form.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
    form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }

  clients = [
    { heading: 'GAMES DELIVERED', number: 77 },
    { heading: 'HAPPY CLIENTS', number: 50 },
    { heading: 'YEARS OF EXPERIENCE', number: 'XX' },
  ];

  SrcWords = [
    {
      word: 'GAME DEVELOPMENT',
      color: '#',
    },
    {
      word: 'GAME DESIGN',
      color: '#FF5722',
    },
    {
      word: 'MOBILE GAMES',
      color: '#00BCD4',
    },
    { word: 'UNREAL ENGINE', color: '#' },
    { word: '2D & 3D GAMES', color: '#' },
    { word: 'VR GAMING', color: '#' },
    { word: 'MULTIPLATFORM DEVELOPMENT', color: '#' },
  ];

  processList = [
    {
      head: 'Game Design Document (GDD)',
      marker: 'text-[#B1DF4F]',
      desc: "We define your game's story, mechanics, levels, characters, and monetization in one clear blueprint, so everyone knows what we're building.",
    },
    {
      head: 'Concept Art',
      marker: 'text-[#BC8AFB]',
      desc: "Our artists sketch characters, environments, and visual style to bring your game's look and feel to life before development begins.",
    },
    {
      head: 'Game Assets Creation',
      marker: 'text-[#FB8ACE]',
      desc: 'We create 2D sprites, 3D models, textures, UI elements, and sound effects that are optimized for smooth performance.',
    },
    {
      head: 'Animation',
      marker: 'text-[#FB8ACE]',
      desc: 'Characters and objects come alive with fluid animations, from idle moves to combat and cutscenes.',
    },
    {
      head: 'Development & Testing',
      marker: 'text-[#FB8ACE]',
      desc: 'Our developers code gameplay, physics, and multiplayer features, then test across devices to remove bugs and lag.',
    },
    {
      line: 'hidden',
      head: 'Launch & Support',
      marker: 'text-[#8AE0FB]',
      desc: 'We publish your game on Google Play, the App Store, Steam, or console stores, and provide updates after launch.',
    },
  ];

  readonly techAssets = 'assets/images/game-design/tech/';

  // width/height are the logo's size in the 312 x 140 design tile; widthPct is its share of the tile width.
  // `full` logos are whole-tile artwork (tile background included).
  techStack = [
    { name: 'Unity', image: 'unity.svg', width: 312, height: 140, widthPct: 100, full: true },
    { name: 'Unreal Engine', image: 'unreal-engine.svg', width: 200, height: 57, widthPct: 64.1, full: false },
    { name: 'Godot', image: 'godot.svg', width: 312, height: 140, widthPct: 100, full: true },
    { name: 'Blender', image: 'blender.svg', width: 237, height: 59, widthPct: 75.8, full: false },
    { name: 'Autodesk Maya', image: 'autodesk-maya.svg', width: 211, height: 53, widthPct: 67.6, full: false },
    { name: 'Autodesk 3ds Max', image: 'autodesk-3ds-max.svg', width: 222, height: 54, widthPct: 71.2, full: false },
    { name: 'Adobe Photoshop', image: 'adobe-photoshop.svg', width: 94, height: 91, widthPct: 30.1, full: false },
    { name: 'Spine', image: 'spine.svg', width: 174, height: 52, widthPct: 55.8, full: false },
    { name: 'C#', image: 'csharp.svg', width: 312, height: 140, widthPct: 100, full: true },
    { name: 'C++', image: 'cpp.svg', width: 312, height: 140, widthPct: 100, full: true },
    { name: 'Android Studio', image: 'android-studio.svg', width: 103, height: 103, widthPct: 33, full: false },
    { name: 'Xcode', image: 'xcode.svg', width: 120, height: 120, widthPct: 38.5, full: false },
  ];
}
