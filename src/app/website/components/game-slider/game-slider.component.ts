import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

declare const $: any; 

@Component({
    selector: 'app-game-slider',
    templateUrl: './game-slider.component.html',
    styleUrls: ['./game-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GameSliderComponent implements AfterViewInit {
 
  ngAfterViewInit(): void {
    const slickPrimary = {
      autoplay: false,
      autoplaySpeed: 2400,
      slidesToShow: 2,
      slidesToScroll: 1,
      speed: 1800,
      cssEase: 'cubic-bezier(.84, 0, .08, .99)',
      asNavFor: '.text-slider',
      // centerMode: true,
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
    };

    const slickSecondary = {
      autoplay: false,
      autoplaySpeed: 2400,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1800,
      cssEase: 'cubic-bezier(.84, 0, .08, .99)',
      asNavFor: '.image-slider',
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
    };

    // Initialize slick sliders
    $('.image-slider').slick(slickPrimary);
    $('.text-slider').slick(slickSecondary);
  }

  slides = [
    {
      title: 'Moba Game',
      description:
        "Our employees are the heart of our company, Here's what they say about working in Carina",
      image: '../../../../assets/images/game-char1.png',
    },
    {
      title: 'Doba Game',
      description:
        "Our employees are the heart of our company, Here's what they say about working in Carina",
      image: '../../../../assets/images/game-char1.png',
    },
    {
      title: 'Joba Game',
      description:
        "Our employees are the heart of our company, Here's what they say about working in Carina",
      image: '../../../../assets/images/game-char1.png',
    },
  ];

}
