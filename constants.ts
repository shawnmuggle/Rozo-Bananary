
import type { Transformation } from './types';

export const TRANSFORMATIONS: Transformation[] = [

  { 
    title: "3D Figurine", 
    prompt: "turn this photo into a character figure. Behind it, place a box with the character’s image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible", 
    emoji: "🧍",
    description: "Turns your photo into a collectible 3D character figurine, complete with packaging."
  },
  { 
    title: "Van Gogh Style", 
    prompt: "Reimagine the photo in the style of Van Gogh's 'Starry Night'.", 
    emoji: "🌌",
    description: "Repaints your photo with the iconic, swirling brushstrokes of 'Starry Night'."
  },


  // two image  elon image + change shirt


  { 
    title: "Cyberpunk", 
    prompt: "Transform the scene into a futuristic cyberpunk city.", 
    emoji: "🤖",
    description: "Transforms your scene into a neon-drenched, futuristic cyberpunk city."
  },


  // Two-image transformations

  { 
    title: "Pose Reference", 
    prompt: "Apply the pose from the second image to the character in the first image. Render as a professional studio photograph.",
    emoji: "💃",
    description: "Applies a pose from one image to a character from another.",
    isMultiImage: true,
    primaryUploaderTitle: "Character",
    primaryUploaderDescription: "The main character",
    secondaryUploaderTitle: "Pose Reference",
    secondaryUploaderDescription: "The pose to apply",
  },

  { 
    title: "Picture Together", 
    prompt: "Seamlessly merge the two people from these images together into one natural-looking photo with professional lighting.", 
    emoji: "👥",
    description: "Combines two people from separate photos into one realistic image.",
    isMultiImage: true,
    primaryUploaderTitle: "First Person",
    primaryUploaderDescription: "The first person to merge",
    secondaryUploaderTitle: "Second Person",
    secondaryUploaderDescription: "The second person to merge",
  },
  { 
    title: "Change Shirt", 
    prompt: "Have the person from the first image wear the shirt/clothing from the second image. Make it look natural and well-fitted.", 
    emoji: "👕",
    description: "Shows how you would look wearing a specific shirt or piece of clothing.",
    isMultiImage: true,
    primaryUploaderTitle: "Person",
    primaryUploaderDescription: "The person who will wear the clothing",
    secondaryUploaderTitle: "Clothing Item",
    secondaryUploaderDescription: "The shirt or clothing to try on",
  },


  { 
    title: "Soda Can Design", 
    prompt: "Design a soda can using this image as the main graphic, and show it in a professional product shot.", 
    emoji: "🥤",
    description: "Wraps your image onto a soda can and places it in a slick product shot."
  },

  // Viral & Fun Transformations
  { 
    title: "Custom Prompt", 
    prompt: "CUSTOM", 
    emoji: "✍️",
    description: "Describe any change you can imagine. Your creativity is the only limit!"
  },
];