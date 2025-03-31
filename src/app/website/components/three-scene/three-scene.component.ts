// import { Component, ElementRef, AfterViewInit } from '@angular/core';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// @Component({
//   selector: 'app-three-scene',
//   templateUrl: './three-scene.component.html',
//   styleUrls: ['./three-scene.component.scss'],
// })
// export class ThreeSceneComponent implements AfterViewInit {
//   private scene!: THREE.Scene;
//   private camera!: THREE.PerspectiveCamera;
//   private renderer!: THREE.WebGLRenderer;
//   private model!: THREE.Object3D;
//   private loader = new GLTFLoader();
//   private scrollY = 0;

//   constructor(private el: ElementRef) {}

//   ngAfterViewInit(): void {
//     this.initScene();
//     this.loadModel();
//     this.animate();
//   }

//   private initScene(): void {
//     const container = this.el.nativeElement;
  
//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera(
//       50, // FOV
//       container.clientWidth / container.clientHeight,
//       0.1,
//       1000
//     );
  
//     this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     this.renderer.setSize(container.clientWidth, container.clientHeight);
//     container.appendChild(this.renderer.domElement);
  
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(5, 5, 5);
//     this.scene.add(light);
  
//     window.addEventListener('resize', () => {
//       const width = container.clientWidth;
//       const height = container.clientHeight;
//       this.renderer.setSize(width, height);
//       this.camera.aspect = width / height;
//       this.camera.updateProjectionMatrix();
//     });
//   }
  

//   private loadModel(): void {
//     this.loader.load('/assets/models/girl.glb', (gltf) => {
//       this.model = gltf.scene;
  
//       // Center and scale the model
//       const box = new THREE.Box3().setFromObject(this.model);
//       const center = box.getCenter(new THREE.Vector3());
//       this.model.position.sub(center);
//       this.model.scale.set(1, 1, 1); // Adjust scale as needed
  
//       this.scene.add(this.model);
  
//       // Fit the camera to the model
//       this.fitCameraToModel(this.model);
//     });
//   }

//   private fitCameraToModel(model: THREE.Object3D): void {
//     const box = new THREE.Box3().setFromObject(model);
//     const size = box.getSize(new THREE.Vector3());
//     const center = box.getCenter(new THREE.Vector3());
  
//     // Center the model
//     model.position.sub(center);
  
//     // Calculate camera distance
//     const maxDimension = Math.max(size.x, size.y, size.z);
//     const cameraDistance = maxDimension / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
  
//     // Position the camera
//     this.camera.position.set(0, 0, cameraDistance + 0.1);
//     this.camera.lookAt(0, 0, 0);
//   }
  
  

//   private animate(): void {
//     requestAnimationFrame(() => this.animate());
//     if (this.model) {
//       this.model.rotation.y = this.scrollY * 0.01; // Increase or decrease the multiplier as needed
//     }
//     this.renderer.render(this.scene, this.camera);
//   }

//   public updateScrollPosition(scrollY: number): void {
//     this.scrollY = scrollY;
//   }
// }


import { Component, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-three-scene',
  templateUrl: './three-scene.component.html',
  styleUrls: ['./three-scene.component.scss'],
})
export class ThreeSceneComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Object3D;
  private loader = new GLTFLoader();
  private scrollY = 0;
  private mouse = { x: 0, y: 0 }; // Store normalized mouse coordinates

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  private initScene(): void {
    const container = this.el.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50, // FOV
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);

    window.addEventListener('resize', () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  private loadModel(): void {
    this.loader.load('/assets/models/Mau.glb', (gltf) => {
      this.model = gltf.scene;

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center);
      this.model.scale.set(1, 1, 1); // Adjust scale as needed

      this.scene.add(this.model);

      // Fit the camera to the model
      this.fitCameraToModel(this.model);
    });
  }

  private fitCameraToModel(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model
    model.position.sub(center);

    // Calculate camera distance
    const maxDimension = Math.max(size.x, size.y, size.z);
    const cameraDistance = maxDimension / (2 * Math.tan((this.camera.fov * Math.PI) / 360));

    // Position the camera
    this.camera.position.set(0, 0, cameraDistance + 0.1);
    this.camera.lookAt(0, 0, 0);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    if (this.model) {
      // Rotate the model on scroll
      this.model.rotation.y = this.scrollY * 0.01;

      // Rotate the model based on cursor movement
      this.model.rotation.x = this.mouse.y * 0.1; // Adjust the multiplier to control sensitivity
      this.model.rotation.y += this.mouse.x * 0.1; // Adjust the multiplier to control sensitivity
    }

    this.renderer.render(this.scene, this.camera);
  }

  public updateScrollPosition(scrollY: number): void {
    this.scrollY = scrollY;
  }

  // Mouse move listener to update cursor position
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const container = this.el.nativeElement;
    const rect = container.getBoundingClientRect();

    // Normalize mouse position to the range [-1, 1]
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
}
