import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial-bubble',
  templateUrl: './testimonial-bubble.component.html',
  styleUrls: ['./testimonial-bubble.component.scss']
})
export class TestimonialBubbleComponent {
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
      name: 'Shubham Yadav',
      imgSrc: '../../assets/images/shubham.png',
      feedback:
        'Best place for an artist to grow and learn, great projects and cool working environment.',
      feedbackClass: 'quote-text-1 show',
      customClass: 'dp-name-1  look',
    },
    // {
    //   name: 'Arizona Derby',
    //   imgSrc: '../../assets/images/client-bub-2.png',
    //   feedback:
    //     'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
    //   feedbackClass: 'quote-text-3 hide-top',
    //   customClass: 'dp-name-3 hide-dp-top',
    // },
    {
      name: 'Aayush Shukla',
      imgSrc: '../../assets/images/aayush.png',
      feedback:
        'Great company to work with. I worked on multiple game development projects over here. Also, learnt technical aspects of Unity & Unreal.',
      feedbackClass: 'quote-text-3 hide-top',
      customClass: 'dp-name-3 hide-dp-top',
    },
    {
      name: 'Piyush Bohra',
      imgSrc: '../../assets/images/piyush.png',
      feedback:
        'I have joined Carina Softlabs as a fresher and I have learnt advanced techniques of SEO. They have good mentors & seniors.',
      feedbackClass: 'quote-text-4 hide-bottom',
      customClass: 'dp-name-4 hide-dp-bottom',
    },
    {
      name: 'Rajesh Sahu',
      imgSrc: '../../assets/images/Rajesh.png',
      feedback:
        "This place is awesome for fresher candidates, the team leader always supports you in every situation.",
      feedbackClass: 'quote-text-5 hide-top',
      customClass: 'dp-name-5 hide-dp-top',
    },
    {
      name: 'Aman Dixit',
      imgSrc: '../../assets/images/aman.png',
      feedback:
        'Its a company you love to work with. Great work, great learning. You have great mentors to guide you.',
      feedbackClass: 'quote-text-6 hide-top',
      customClass: 'dp-name-6 hide-dp-top',
    },
    {
      name: 'Pukhraj Maheshwari',
      imgSrc: '../../assets/images/pukhraj.png',
      feedback:
        'Open culture, team spirit, and appreciation for detail-oriented design make Carina Softlabs a perfect place for designers to thrive',
      feedbackClass: 'quote-text-7  hide-top',
      customClass: 'dp-name-7  hide-dp-top',
    },
  ];
}
