// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-know4',
//   templateUrl: './know4.component.html',
//   styleUrls: ['./know4.component.scss'],
// })
// export class Know4Component {
//   // activeImage: string = 'image1';

//   // setActiveImage(image: string) {
//   //   this.activeImage = image;
//   // }
//   // // activeTab: string = 'tab1';

//   // ngOnInit(): void {
//   //   // this.initQuotes();
//   //   // this.activeTab === 'tab1'
//   //   // this.activeTab = 'tab1';
//   // }

//   // initQuotes(): void {
//   //   console.log('sdfs ')
//   //   const quotes = document.querySelectorAll('.quote');
//   //   const dpNames = document.querySelectorAll('.box-dpname');
//   //   const peQuotes = document.querySelectorAll('.pp-quote');
//   //   let currentIndex = 0;

//   //   function showCurrentQuote() {
//   //     quotes.forEach((quote, index) => {
//   //       if (index === currentIndex) {
//   //         quote.classList.add('show');
//   //         quote.classList.remove('hide-top', 'hide-bottom');
//   //       } else {
//   //         quote.classList.remove('show');
//   //         if (index < currentIndex) {
//   //           quote.classList.add('hide-top');
//   //         } else {
//   //           quote.classList.add('hide-bottom');
//   //         }
//   //       }
//   //     });

//   //     dpNames.forEach((dpName, index) => {
//   //       if (index === currentIndex) {
//   //         dpName.classList.add('look');
//   //         dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
//   //       } else {
//   //         dpName.classList.remove('look');
//   //         if (index < currentIndex) {
//   //           dpName.classList.add('hide-dp-top');
//   //         } else {
//   //           dpName.classList.add('hide-dp-bottom');
//   //         }
//   //       }
//   //     });

//   //     peQuotes.forEach((peQuote, index) => {
//   //       if (index === currentIndex) {
//   //         peQuote.classList.add('active');
//   //       } else {
//   //         peQuote.classList.remove('active');
//   //       }
//   //     });
//   //   }

//   //   function nextQuote() {
//   //     currentIndex = (currentIndex + 1) % quotes.length;
//   //     showCurrentQuote();
//   //   }

//   //   // Initial display
//   //   showCurrentQuote();

//   //   // Change quotes every 3 seconds
//   //   setInterval(nextQuote, 4000);
//   // }

//   //   changeActiveQuote(index: number): void {
//   //     const quotes = document.querySelectorAll('.quote');
//   //     const dpNames = document.querySelectorAll('.box-dpname');
//   //     const peQuotes = document.querySelectorAll('.pp-quote');

//   //     // Update currentIndex to the clicked index
//   //     const currentIndex = index;

//   //     function showCurrentQuote() {
//   //       quotes.forEach((quote, i) => {
//   //         if (i === currentIndex) {
//   //           quote.classList.add('show');
//   //           quote.classList.remove('hide-top', 'hide-bottom');
//   //         } else {
//   //           quote.classList.remove('show');
//   //           if (i < currentIndex) {
//   //             quote.classList.add('hide-top');
//   //           } else {
//   //             quote.classList.add('hide-bottom');
//   //           }
//   //         }
//   //       });

//   //       dpNames.forEach((dpName, i) => {
//   //         if (i === currentIndex) {
//   //           dpName.classList.add('look');
//   //           dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
//   //         } else {
//   //           dpName.classList.remove('look');
//   //           if (i < currentIndex) {
//   //             dpName.classList.add('hide-dp-top');
//   //           } else {
//   //             dpName.classList.add('hide-dp-bottom');
//   //           }
//   //         }
//   //       });

//   //       peQuotes.forEach((peQuote, i) => {
//   //         if (i === currentIndex) {
//   //           peQuote.classList.add('active');
//   //         } else {
//   //           peQuote.classList.remove('active');
//   //         }
//   //       });
//   //     }

//   //     // Call showCurrentQuote to display the clicked quote
//   //     showCurrentQuote();
//   // }

//   // showTab(tabId: string) {
//   //   this.activeTab = tabId;
//   // }

//   activeImage!: string;

//   items = [
//     {
//       title: 'Growth',
//       image: '../../../assets/images/img-1-hover.png',
//       hoverColor: 'text-purple-500 !border-purple-500',
//     },
//     {
//       title: 'WORK-LIFE BALANCE',
//       image: '../../../assets/images/img-2-hover.png',
//       hoverColor: 'text-pink-500  !border-pink-500',
//     },
//     {
//       title: 'ATMOSPHERE',
//       image: '../../../assets/images/img-3-hover.png',
//       hoverColor: 'text-cyan-500  !border-cyan-500',
//     },
//     {
//       title: 'Health & Wellness',
//       image: '../../../assets/images/img-4-hover.png',
//       hoverColor: 'text-lime-500 !border-lime-500',
//     },
//   ];

//   ngOnInit() {
//     // Set the first item as the active image initially
//     this.activeImage = this.items[0].image;
//   }

//   getClass(item: any): string[] {
//     return this.activeImage === item.image ? [item.hoverColor] : ['text-black'];
//   }

//   setActiveImage(image: string) {
//     this.activeImage = image;
//   }

//   roles = [
//     {
//       id: 1,
//       position: 'Developer',
//     },
//     {
//       id: 2,
//       position: 'Designer',
//     },
//     {
//       id: 3,
//       position: 'Marketing',
//     },
//     {
//       id: 4,
//       position: 'Manager',
//     },
//   ];

//   roleCard = [
//     {
//       id: 1,
//       role: 'Developer',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 5,
//       role: 'Developer',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 6,
//       role: 'Developer',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 7,
//       role: 'Developer',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 2,
//       role: 'Designer',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 3,
//       role: 'Marketing',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//     {
//       id: 4,
//       role: 'Manager',
//       tech: 'Unity',
//       experience: 'fresher/1 year',
//     },
//   ];

//   selectedRoleCategory: string = 'Developer';

//   selectRoleCategory(category: string): void {
//     this.selectedRoleCategory = category;
//   }

//   getFilteredCards() {
//     return this.roleCard.filter(
//       (card) => card.role === this.selectedRoleCategory
//     );
//   }

//   isActiveCategory(category: string): boolean {
//     return this.selectedRoleCategory === category;
//   }

//   // modal
//   isModalVisible: boolean = false;

//   // Open the modal
//   openModal() {
//     this.isModalVisible = true;
//   }

//   // Close the modal
//   closeModal() {
//     this.isModalVisible = false;
//   }
// }


import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

interface JobPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  skillImage: string[];
  roleCategory: string;
  employmentType: string;
  location: string;
  experience: string;
  noOfPositions: number;
  applicationDeadline: string;
  salary: string;
  isFeatured: boolean;
  active: boolean;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    data: JobPost[];
  };
}

@Component({
  selector: 'app-know4',
  templateUrl: './know4.component.html',
  styleUrls: ['./know4.component.scss'],
})
export class Know4Component implements OnInit, OnDestroy {
  private seoElements: HTMLElement[] = [];

  cards: JobPost[] = [];
  apiUrl = `${environment.apiUrl}/admin/getAllCareerJobPost`;
  imageUrl = `${environment.imageBaseUrl}`;
  filteredCards: JobPost[] = [];
  roles = [
    { id: 1, position: 'Game Development' },
    { id: 2, position: 'Digital Marketing' },
    { id: 3, position: 'Web/App Development' },
    { id: 4, position: 'Business Development' },
  ];

  employments = [
    { id: 1, type: 'Full-time' },
    { id: 2, type: 'Part-time' },
    { id: 3, type: 'Contract' },
    { id: 4, type: 'Internship' },
  ];
  searchTerm: string = '';
  selectedRoleCategory: string = 'Game Development'; // Default filter category
  selectedEmploymentType: string = 'Full-time';

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'Join Our Team | Build Your Career in Technology & Innovation'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity, and innovation.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/careers');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.fetchJobPosts();
    this.activeImage = this.items[0].image;
    this.filteredCards = this.getFilteredCards();

  }

  ngOnDestroy(): void {
    this.seoElements.forEach((el) => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
    this.seoElements = [];
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(
      "link[rel='canonical']"
    );
    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, link);
      this.seoElements.push(link as HTMLElement);
    }
    this.renderer.setAttribute(link, 'href', url);
  }

  private setOpenGraphTags(): void {
    const title = 'Careers | Build Your Future in Technology & Innovation';
    const description =
      'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity and innovation.';
    const url = 'https://carinasoftlabs.com/careers';
    const image =
      'https://carinasoftlabs.com/assets/images/employee%20group%20photo.webp';

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Carina Softlabs Inc.' });
    this.metaService.updateTag({ property: 'og:image', content: image });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://carinasoftlabs.com/careers#webpage',
          url: 'https://carinasoftlabs.com/careers',
          name: 'Careers | Build Your Future in Technology & Innovation',
          description:
            'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity, and innovation.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/careers#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://carinasoftlabs.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Careers',
              item: 'https://carinasoftlabs.com/careers',
            },
          ],
        },
      ],
    };

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    script.text = JSON.stringify(schema);
    this.renderer.appendChild(this.document.head, script);
    this.seoElements.push(script);
  }

  fetchJobPosts(): void {
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.cards = response.data.data.map((item) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          content: item.content,
          image: item.image || '',
          skillImage: item.skillImage || [],
          roleCategory: item.roleCategory,
          employmentType: item.employmentType,
          location: item.location,
          experience: item.experience,
          noOfPositions: item.noOfPositions,
          applicationDeadline: item.applicationDeadline,
          salary: item.salary,
          isFeatured: item.isFeatured,
          active: item.active,
        }));

        this.filteredCards = this.getFilteredCards();
      },
      error: (error) => {
        console.error('Error fetching job posts data:', error);
      },
    });
  }

  selectRoleCategory(category: string): void {
    this.selectedRoleCategory = category;
    this.filteredCards = this.getFilteredCards(); 
  }

  selectEmploymentType(type: string): void {
    this.selectedEmploymentType = type;
    this.filteredCards = this.getFilteredCards();
  }


  // getFilteredCards() {
  //   return this.cards.filter(
  //     (card) =>
  //       card.roleCategory.toLowerCase() ===
  //         this.selectedRoleCategory.toLowerCase() &&
  //       card.employmentType.toLowerCase().replace('-', '') ===
  //         this.selectedEmploymentType.toLowerCase().replace('-', '')
  //   );
  // }

  getFilteredCards() {
    return this.cards.filter((card) => {
      const matchesTitle = !this.searchTerm || card.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRoleCategory || card.roleCategory.toLowerCase() === this.selectedRoleCategory.toLowerCase();
      const matchesEmployment = !this.selectedEmploymentType || 
        card.employmentType.toLowerCase().replace('-', '') === this.selectedEmploymentType.toLowerCase().replace('-', '');
  
      return matchesTitle && matchesRole && matchesEmployment;
    });
  }
  
  // filterJobs() {
  //   this.cards = this.getFilteredCards();
  // }
  
  filterJobs() {
    const search = this.searchTerm.toLowerCase();
  
    // Try to find a matching card based on the search
    const matchingCard = this.cards.find(card =>
      card.title.toLowerCase().includes(search)
    );
  
    // If found, update selectedRoleCategory
    if (matchingCard) {
      this.selectedRoleCategory = matchingCard.roleCategory;
      this.selectedEmploymentType = matchingCard.employmentType;
    }
  
    // Then filter the cards
    this.filteredCards = this.getFilteredCards();
  }
  

  isActiveCategory(category: string): boolean {
    return this.selectedRoleCategory === category;
  }

  isActiveEmployment(type: string): boolean {
    return this.selectedEmploymentType === type;
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/job-fallback.png';
  }

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

  // ngOnInit() {

  //   this.activeImage = this.items[0].image;
  // }

  getClass(item: any): string[] {
    return this.activeImage === item.image ? [item.hoverColor] : ['text-black'];
  }

  setActiveImage(image: string) {
    this.activeImage = image;
  }

  // roles = [
  //   {
  //     id: 1,
  //     position: 'Developer',
  //   },
  //   {
  //     id: 2,
  //     position: 'Designer',
  //   },
  //   {
  //     id: 3,
  //     position: 'Marketing',
  //   },
  //   {
  //     id: 4,
  //     position: 'Manager',
  //   },
  // ];

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

  // selectedRoleCategory: string = 'Developer';

  // selectRoleCategory(category: string): void {
  //   this.selectedRoleCategory = category;
  // }

  // getFilteredCards() {
  //   return this.roleCard.filter(
  //     (card) => card.role === this.selectedRoleCategory
  //   );
  // }

  // isActiveCategory(category: string): boolean {
  //   return this.selectedRoleCategory === category;
  // }

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
