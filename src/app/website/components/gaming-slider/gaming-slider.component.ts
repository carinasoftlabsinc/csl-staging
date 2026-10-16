import { ChangeDetectionStrategy, Component } from '@angular/core';

interface GamingServiceCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly width: number;
  readonly height: number;
}

@Component({
  selector: 'app-gaming-slider',
  templateUrl: './gaming-slider.component.html',
  styleUrls: ['./gaming-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GamingSliderComponent {
  readonly cards: readonly GamingServiceCard[] = [
    {
      id: '2d',
      title: '2D GAMING',
      description: 'Colorful, fast, and engaging. Our 2D game development services cover casual, puzzle, arcade, and platformer games with smooth gameplay and eye-catching art.',
      image: 'assets/images/2DGame.webp',
      width: 558,
      height: 716,
      
    },
    {
      id: '3d',
      title: '3D GAMING',
      description: 'Realistic worlds and rich characters. We build 3D games using Unity and Unreal game development services for high-quality graphics, physics, and performance.',
      image: 'assets/images/2DGame-2.webp',
      width: 558,
      height: 716,
      
    },
    {
      id: 'vr',
      title: 'VR GAMING',
      description: 'Step inside the game. We create immersive VR experiences for Meta Quest and other headsets that feel natural and keep players engaged.',
      image: 'assets/images/2DGame-3.webp',
      width: 558,
      height: 716,
      
    },
    {
      id: 'mobile',
      title: 'MOBILE GAMING',
      description: 'Games built for players on the go. As a trusted Android game development company, we also build for iOS, with games optimized for every screen size and device.',
      image: 'assets/images/mobile-gaming.webp',
      width: 1024,
      height: 1536,
     
    },
  ];
}
