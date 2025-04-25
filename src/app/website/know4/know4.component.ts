import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-know4',
  templateUrl: './know4.component.html',
  styleUrls: ['./know4.component.scss'],
})
export class Know4Component {
  // activeImage: string = 'image1';

  // setActiveImage(image: string) {
  //   this.activeImage = image;
  // }
  // // activeTab: string = 'tab1';

  // ngOnInit(): void {
  //   // this.initQuotes();
  //   // this.activeTab === 'tab1'
  //   // this.activeTab = 'tab1';
  // }

  // initQuotes(): void {
  //   console.log('sdfs ')
  //   const quotes = document.querySelectorAll('.quote');
  //   const dpNames = document.querySelectorAll('.box-dpname');
  //   const peQuotes = document.querySelectorAll('.pp-quote');
  //   let currentIndex = 0;

  //   function showCurrentQuote() {
  //     quotes.forEach((quote, index) => {
  //       if (index === currentIndex) {
  //         quote.classList.add('show');
  //         quote.classList.remove('hide-top', 'hide-bottom');
  //       } else {
  //         quote.classList.remove('show');
  //         if (index < currentIndex) {
  //           quote.classList.add('hide-top');
  //         } else {
  //           quote.classList.add('hide-bottom');
  //         }
  //       }
  //     });

  //     dpNames.forEach((dpName, index) => {
  //       if (index === currentIndex) {
  //         dpName.classList.add('look');
  //         dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
  //       } else {
  //         dpName.classList.remove('look');
  //         if (index < currentIndex) {
  //           dpName.classList.add('hide-dp-top');
  //         } else {
  //           dpName.classList.add('hide-dp-bottom');
  //         }
  //       }
  //     });

  //     peQuotes.forEach((peQuote, index) => {
  //       if (index === currentIndex) {
  //         peQuote.classList.add('active');
  //       } else {
  //         peQuote.classList.remove('active');
  //       }
  //     });
  //   }

  //   function nextQuote() {
  //     currentIndex = (currentIndex + 1) % quotes.length;
  //     showCurrentQuote();
  //   }

  //   // Initial display
  //   showCurrentQuote();

  //   // Change quotes every 3 seconds
  //   setInterval(nextQuote, 4000);
  // }

  //   changeActiveQuote(index: number): void {
  //     const quotes = document.querySelectorAll('.quote');
  //     const dpNames = document.querySelectorAll('.box-dpname');
  //     const peQuotes = document.querySelectorAll('.pp-quote');

  //     // Update currentIndex to the clicked index
  //     const currentIndex = index;

  //     function showCurrentQuote() {
  //       quotes.forEach((quote, i) => {
  //         if (i === currentIndex) {
  //           quote.classList.add('show');
  //           quote.classList.remove('hide-top', 'hide-bottom');
  //         } else {
  //           quote.classList.remove('show');
  //           if (i < currentIndex) {
  //             quote.classList.add('hide-top');
  //           } else {
  //             quote.classList.add('hide-bottom');
  //           }
  //         }
  //       });

  //       dpNames.forEach((dpName, i) => {
  //         if (i === currentIndex) {
  //           dpName.classList.add('look');
  //           dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
  //         } else {
  //           dpName.classList.remove('look');
  //           if (i < currentIndex) {
  //             dpName.classList.add('hide-dp-top');
  //           } else {
  //             dpName.classList.add('hide-dp-bottom');
  //           }
  //         }
  //       });

  //       peQuotes.forEach((peQuote, i) => {
  //         if (i === currentIndex) {
  //           peQuote.classList.add('active');
  //         } else {
  //           peQuote.classList.remove('active');
  //         }
  //       });
  //     }

  //     // Call showCurrentQuote to display the clicked quote
  //     showCurrentQuote();
  // }

  // showTab(tabId: string) {
  //   this.activeTab = tabId;
  // }

  activeImage!: string;

  items = [
    {
      title: 'Growth',
      image: '../../../assets/images/img-1-hover.png',
      hoverColor: 'text-purple-500 !border-purple-500',
    },
    {
      title: 'WORK-LIFE BALANCE',
      image: '../../../assets/images/img-2-hover.png',
      hoverColor: 'text-pink-500  !border-pink-500',
    },
    {
      title: 'ATMOSPHERE',
      image: '../../../assets/images/img-3-hover.png',
      hoverColor: 'text-cyan-500  !border-cyan-500',
    },
    {
      title: 'Health & Wellness',
      image: '../../../assets/images/img-4-hover.png',
      hoverColor: 'text-lime-500 !border-lime-500',
    },
  ];

  ngOnInit() {
    // Set the first item as the active image initially
    this.activeImage = this.items[0].image;
  }

  getClass(item: any): string[] {
    return this.activeImage === item.image ? [item.hoverColor] : ['text-black'];
  }

  setActiveImage(image: string) {
    this.activeImage = image;
  }

  roles = [
    {
      id: 1,
      position: 'Developer',
    },
    {
      id: 2,
      position: 'Designer',
    },
    {
      id: 3,
      position: 'Marketing',
    },
    {
      id: 4,
      position: 'Manager',
    },
  ];

  roleCard = [
    {
      id: 1,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 5,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 6,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 7,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 2,
      role: 'Designer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 3,
      role: 'Marketing',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 4,
      role: 'Manager',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
  ];

  selectedRoleCategory: string = 'Developer';

  selectRoleCategory(category: string): void {
    this.selectedRoleCategory = category;
  }

  getFilteredCards() {
    return this.roleCard.filter(
      (card) => card.role === this.selectedRoleCategory
    );
  }

  isActiveCategory(category: string): boolean {
    return this.selectedRoleCategory === category;
  }

  // modal
  isModalVisible: boolean = false;

  // Open the modal
  openModal() {
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal() {
    this.isModalVisible = false;
  }
}
