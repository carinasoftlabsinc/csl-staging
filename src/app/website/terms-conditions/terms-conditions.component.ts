import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.component.html',
    styleUrls: ['./terms-conditions.component.scss'],
    standalone: false
})
export class TermsConditionsComponent implements OnInit {

  cardText: string = `Partner with Clarity
Understand Our Terms Before We Begin.`;

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Terms & Conditions - Carina Softlabs Inc.');
    this.metaService.updateTag({
      name: 'description',
      content: 'Read the Terms and Conditions of Carina Softlabs Inc. to understand the rules and guidelines for using our website and services.'
    });
  }
}