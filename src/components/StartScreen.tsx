import { useAccessibility } from './AccessibilityProvider';
import svgPaths from "../imports/svg-uhkqhc7a2v";

type Route = 
  | '/'
  | '/child'
  | '/parent'
  | '/child/art'
  | '/child/music'
  | '/child/games'
  | '/child/video'
  | '/child/treasure'
  | '/parent/resources'
  | '/parent/medical'
  | '/parent/contacts'
  | '/parent/ai-agent'
  | '/notes'
  | '/parent/affirmations';

interface Props {
  navigate: (route: Route) => void;
}

function Logo() {
  return (
      <div className="w-32 h-32 mx-auto">
        <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 110 41" xmlnsXlink="http://www.w3.org/1999/xlink">
          <g id="logo">
            <g filter="url(#filter0_dn_3_105)" id="Vector 4">
              <path d={svgPaths.p15c56880} fill="var(--fill-0, #2E5580)" />
              <path d={svgPaths.p9789680} fill="var(--fill-0, #2E5580)" />
            </g>
            <g filter="url(#filter1_dn_3_105)" id="Vector 5">
              <path d={svgPaths.pa3f6b20} fill="var(--fill-0, #7CBEA1)" />
            </g>
            <g filter="url(#filter2_dn_3_105)" id="Vector 2">
              <path d={svgPaths.p39333b00} fill="var(--fill-0, #2E5580)" />
            </g>
            <g filter="url(#filter3_dn_3_105)" id="Vector 3">
              <path d={svgPaths.pbd68400} fill="var(--fill-0, #2E5580)" />
            </g>
            <g filter="url(#filter4_d_3_105)" id="buddy b">
              <g id="Ellipse 6">
                <path d={svgPaths.p37d15480} fill="var(--fill-0, #2E5580)" />
                <path d={svgPaths.p37d15480} fill="url(#paint0_linear_3_105)" fillOpacity="0.2" />
              </g>
              <path d={svgPaths.p21e4ed0} fill="var(--fill-0, #76566C)" id="Vector 1" />
            </g>
            <g filter="url(#filter5_n_3_105)" id="Ellipse 7">
              <ellipse cx="42.8439" cy="5.00253" fill="var(--fill-0, #7CBEA1)" rx="3.7218" ry="3.30664" />
            </g>
            <g id="L eye closed">
              <ellipse cx="2.21118" cy="3.04746" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" rx="2.21118" ry="3.04746" transform="matrix(0.983553 -0.18062 0.168688 0.98567 9.34771 9.10794)" />
              <ellipse cx="1.16427" cy="1.20345" fill="var(--fill-0, #1E1E1E)" id="Ellipse 4" rx="1.16427" ry="1.20345" transform="matrix(0.983553 -0.18062 0.168688 0.98567 11.3003 10.6076)" />
            </g>
            <g id="right eye closed">
              <ellipse cx="2.20902" cy="3.03155" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3_2" rx="2.20902" ry="3.03155" transform="matrix(0.99804 0.0625756 -0.0583314 0.998297 22.3555 8.30917)" />
              <ellipse cx="1.12608" cy="1.15904" fill="var(--fill-0, #1E1E1E)" id="Ellipse 4_2" rx="1.12608" ry="1.15904" transform="matrix(0.99804 0.0625756 -0.0583314 0.998297 23.0465 9.95728)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.0781" id="filter0_dn_3_105" width="44.284" x="41.5926" y="6.59942">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_105" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="8375" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise2">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise2" in2="shape" operator="in" result="noise2Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color2Flood" />
              <feComposite in="color2Flood" in2="noise2Clipped" operator="in" result="color2" />
              <feMerge result="effect2_noise_3_105">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
                <feMergeNode in="color2" />
              </feMerge>
              <feBlend in="effect2_noise_3_105" in2="effect1_dropShadow_3_105" mode="normal" result="effect2_noise_3_105" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="38.74" id="filter1_dn_3_105" width="32.4424" x="77.2166" y="2.13308">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_105" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="8375" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise2">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise2" in2="shape" operator="in" result="noise2Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color2Flood" />
              <feComposite in="color2Flood" in2="noise2Clipped" operator="in" result="color2" />
              <feMerge result="effect2_noise_3_105">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
                <feMergeNode in="color2" />
              </feMerge>
              <feBlend in="effect2_noise_3_105" in2="effect1_dropShadow_3_105" mode="normal" result="effect2_noise_3_105" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="38.9738" id="filter2_dn_3_105" width="16.565" x="26.6127" y="0.669206">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_105" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="8375" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise2">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise2" in2="shape" operator="in" result="noise2Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color2Flood" />
              <feComposite in="color2Flood" in2="noise2Clipped" operator="in" result="color2" />
              <feMerge result="effect2_noise_3_105">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
                <feMergeNode in="color2" />
              </feMerge>
              <feBlend in="effect2_noise_3_105" in2="effect1_dropShadow_3_105" mode="normal" result="effect2_noise_3_105" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="30.533" id="filter3_dn_3_105" width="16.2406" x="34.1318" y="8.84798">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_105" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="8375" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise2">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise2" in2="shape" operator="in" result="noise2Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color2Flood" />
              <feComposite in="color2Flood" in2="noise2Clipped" operator="in" result="color2" />
              <feMerge result="effect2_noise_3_105">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
                <feMergeNode in="color2" />
              </feMerge>
              <feBlend in="effect2_noise_3_105" in2="effect1_dropShadow_3_105" mode="normal" result="effect2_noise_3_105" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="39.8127" id="filter4_d_3_105" width="35.8948" x="2.38419e-07" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_105" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_105" mode="normal" result="shape" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.89913" id="filter5_n_3_105" width="10.0158" x="37.8172" y="0.72569">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="3.3333332538604736 3.3333332538604736" numOctaves="3" result="noise" seed="1008" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="shape" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect1_noise_3_105">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_105" x1="17.9531" x2="17.9531" y1="1.69588" y2="30.3535">
              <stop stopOpacity="0" />
              <stop offset="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
}

export default function StartScreen({ navigate }: Props) {
  const { speak } = useAccessibility();

  const handleStart = (mode: 'child' | 'parent') => {
    speak(`Starting ${mode} mode`);
    navigate(`/${mode}` as Route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-cream to-sage-green/20 flex flex-col items-center justify-center px-6 py-12 canvas-texture" data-name="start">
      <div className="max-w-2xl w-full space-y-12">
        
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-calm-slate">
              Emotional Regulation
            </h1>
            <p className="text-forest-green opacity-80">For Kids</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center space-y-1 px-4">
          <p className="text-forest-green/70">Learn skills,</p>
          <p className="text-forest-green/70">enhance overall well-being.</p>
        </div>
        
        {/* Action Buttons - Large Touch Targets */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <button
            onClick={() => handleStart('child')}
            className="bg-sage-green hover:bg-sage-green/90 text-deep-black min-h-[72px] px-10 py-6 rounded-3xl shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-warm-orange/50 active:scale-[0.98] paint-texture"
            onMouseEnter={() => speak('Child Mode')}
            aria-label="Start Child Mode - For children to explore activities and express feelings"
          >
            <span className="block mb-1">Child Mode</span>
            <span className="block text-sm opacity-70">Activities & Games</span>
          </button>
          <button
            onClick={() => handleStart('parent')}
            className="bg-calm-slate hover:bg-calm-slate/90 text-calm-cream min-h-[72px] px-10 py-6 rounded-3xl shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-warm-orange/50 active:scale-[0.98] paint-texture"
            onMouseEnter={() => speak('Parent Mode')}
            aria-label="Start Parent Mode - For caregivers to access resources and track progress"
          >
            <span className="block mb-1">Parent Mode</span>
            <span className="block text-sm opacity-70">Resources & Support</span>
          </button>
        </div>

        {/* Accessibility Note */}
        <div className="text-center">
          <p className="text-xs text-forest-green/60">Designed with accessibility in mind</p>
        </div>
      </div>
    </div>
  );
}