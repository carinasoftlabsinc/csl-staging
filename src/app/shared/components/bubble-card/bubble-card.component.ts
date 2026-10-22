import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-bubble-card',
    templateUrl: './bubble-card.component.html',
    styleUrls: ['./bubble-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BubbleCardComponent {
  changeActiveQuote(index: number): void {
    const quotes = document.querySelectorAll('.quote');
    const dpNames = document.querySelectorAll('.box-dpname');
    const peQuotes = document.querySelectorAll('.pp-quote');

    // Update currentIndex to the clicked index
    const currentIndex = index;

    function showCurrentQuote() {
      quotes.forEach((quote, i) => {
        if (i === currentIndex) {
          quote.classList.add('show');
          quote.classList.remove('hide-top', 'hide-bottom');
        } else {
          quote.classList.remove('show');
          if (i < currentIndex) {
            quote.classList.add('hide-top');
          } else {
            quote.classList.add('hide-bottom');
          }
        }
      });

      dpNames.forEach((dpName, i) => {
        if (i === currentIndex) {
          dpName.classList.add('look');
          dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
        } else {
          dpName.classList.remove('look');
          if (i < currentIndex) {
            dpName.classList.add('hide-dp-top');
          } else {
            dpName.classList.add('hide-dp-bottom');
          }
        }
      });

      peQuotes.forEach((peQuote, i) => {
        if (i === currentIndex) {
          peQuote.classList.add('active');
        } else {
          peQuote.classList.remove('active');
        }
      });
    }

    // Call showCurrentQuote to display the clicked quote
    showCurrentQuote();
  }

  clients = [
    {
      name: 'Arunanchal Film Festival',
      imgSrc: '../../assets/images/client-bub-1.webp',
      alt: 'Arunachal Film Festival logo',
      feedback:
        'The website is really good. Thanks, Carina for making this event successful.',
      feedbackClass: 'quote-text-1 show',
      customClass: 'dp-name-1  look',
    },
    // {
    //   name: 'Arizona Derby',
    //   imgSrc: '../../assets/images/client-bub-2.webp',
    //   feedback:
    //     'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
    //   feedbackClass: 'quote-text-3 hide-top',
    //   customClass: 'dp-name-3 hide-dp-top',
    // },
    {
      name: 'Peniel Global General Consulting Inc.',
      imgSrc: '../../assets/images/client-bub-2.webp',
      alt: 'Peniel Global General Consulting Inc. logo',
      feedback:
        'Creating Heaven Missions was an enriching experience. It allowed us to bring Christian teachings to life through engaging gameplay and thoughtful design',
      feedbackClass: 'quote-text-3 hide-top',
      customClass: 'dp-name-3 hide-dp-top',
    },
    {
      name: 'Space M',
      imgSrc: '../../assets/images/client-bub-3.webp',
      alt: 'Space M logo',
      feedback:
        'The Teamwork is good. fastest service I got both the applications and website in just 5 months.',
      feedbackClass: 'quote-text-4 hide-bottom',
      customClass: 'dp-name-4 hide-dp-bottom',
    },
    {
      name: 'Ballegro - Your Pocket Pianist',
      imgSrc: '../../assets/images/client-bub-4.webp',
      alt: 'Ballegro| Your Pocket Pianist app logo',
      feedback:
        "Carina teamwork is incredible and amazing. It's good to work with them",
      feedbackClass: 'quote-text-5 hide-top',
      customClass: 'dp-name-5 hide-dp-top',
    },
    {
      name: 'Bravo - Tip or Pay',
      imgSrc: '../../assets/images/client-bub-5.webp',
      alt: 'Bravo| Tip or Pay app logo',
      feedback:
        'The Website and Application seems perfectly done. I will surely recommend them to others.',
      feedbackClass: 'quote-text-6 hide-top',
      customClass: 'dp-name-6 hide-dp-top',
    },
    {
      name: 'E-Food',
      imgSrc: '../../assets/images/client-bub-6.webp',
      alt: 'E-Food logo',
      feedback:
        'Carina has always been the most trustworthy company for me. I got all the applications on time. Very reliable, fastest delivery and very humble team.',
      feedbackClass: 'quote-text-7  hide-top',
      customClass: 'dp-name-7  hide-dp-top',
    },
  ];
}
