<template>
  <div class="podium">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 400"
        text-rendering="geometricPrecision"
        shape-rendering="geometricPrecision">
        <!-- Podium - Second place (gauche) -->
        <rect
          x="100"
          y="240"
          width="80"
          height="100"
          rx="5"
          ry="5"
          fill="#C0C0C0"
          stroke="#888"
          stroke-width="2" />
        <text
          x="140"
          y="300"
          font-family="Arial"
          font-size="24"
          text-anchor="middle"
          fill="#333">
          2
        </text>

        <!-- Podium - First place (milieu) -->
        <rect
          x="210"
          y="200"
          width="80"
          height="140"
          rx="5"
          ry="5"
          fill="#FFD700"
          stroke="#CC9900"
          stroke-width="2" />
        <text
          x="250"
          y="280"
          font-family="Arial"
          font-size="24"
          text-anchor="middle"
          fill="#333">
          1
        </text>

        <!-- Podium - Third place (droite) -->
        <rect
          x="320"
          y="260"
          width="80"
          height="80"
          rx="5"
          ry="5"
          fill="#CD7F32"
          stroke="#A05A2C"
          stroke-width="2" />
        <text
          x="360"
          y="300"
          font-family="Arial"
          font-size="24"
          text-anchor="middle"
          fill="#333">
          3
        </text>

        <!-- Ligne de base -->
        <rect
          x="50"
          y="340"
          width="400"
          height="20"
          fill="#8B4513"
          stroke="#5c2d0e"
          stroke-width="2" />

        <!-- Titre -->
        <text
          x="250"
          y="50"
          font-family="Impact, fantasy"
          font-size="30"
          text-anchor="middle"
          fill="#333">
          PODIUM CLÉMENTINES
        </text>

        <!-- Joueurs de babyfoot sur le podium -->
        <!-- Premier joueur sur podium or -->
        <g transform="translate(250, 200) scale(0.6)">
          <rect
            x="-10"
            y="-50"
            width="20"
            height="30"
            rx="3"
            ry="3"
            fill="#1E90FF"
            stroke="#0000CD"
            stroke-width="1.5" />
          <circle
            cx="0"
            cy="-60"
            r="10"
            fill="#FFD1B5"
            stroke="#0000CD"
            stroke-width="1" />
        </g>

        <!-- Deuxième joueur sur podium argent -->
        <g transform="translate(140, 240) scale(0.6)">
          <rect
            x="-10"
            y="-50"
            width="20"
            height="30"
            rx="3"
            ry="3"
            fill="#DD2222"
            stroke="#8B0000"
            stroke-width="1.5" />
          <circle
            cx="0"
            cy="-60"
            r="10"
            fill="#FFD1B5"
            stroke="#8B0000"
            stroke-width="1" />
        </g>

        <!-- Troisième joueur sur podium bronze -->
        <g transform="translate(360, 260) scale(0.6)">
          <rect
            x="-10"
            y="-50"
            width="20"
            height="30"
            rx="3"
            ry="3"
            fill="#32CD32"
            stroke="#006400"
            stroke-width="1.5" />
          <circle
            cx="0"
            cy="-60"
            r="10"
            fill="#FFD1B5"
            stroke="#006400"
            stroke-width="1" />
        </g>

        <!-- Clémentines d'or -->
        <g transform="translate(220, 120) scale(0.25)">
          <path
            fill="#FFD700"
            d="M0,0C12.1295,8.255,20.0247,20.5972,23.3125,34.875C25.106,51.6042,21.2011,66.5875,10.6914,79.9336C1.0651,90.2986,-11.7622,95.8209,-25.7659,96.3457C-41.6724,96.5333,-52.7063,91.4923,-64.375,80.75C-73.9585,70.7763,-78.6773,58.1543,-79.125,44.5C-78.7597,28.8408,-72.2041,15.2328,-60.9727,4.4648C-43.5321,-10.1953,-19.3504,-11.2744,0,0z" />
          <path
            fill="#FFD700"
            transform="translate(-75, 15)"
            d="M0,0C0.66,0.66,1.32,1.32,2,2C1.6623,2.7012,1.3245,3.4025,0.9766,4.125C-6.477,19.9799,-6.5895,34.4195,-1,51C1.0334,55.5551,3.1053,60.1229,6.6836,63.668C8,65,8,65,8,67C-1.0048,70.8592,-10.9822,71.8157,-20.418,68.9688C-30.1519,64.5274,-37.2013,57.0226,-41,47C-43.5059,39.55,-43.4104,28.0504,-40.25,20.8125C-39.5361,19.521,-38.7892,18.2469,-38,17C-37.4225,15.9688,-36.845,14.9375,-36.25,13.875C-26.3955,1.2832,-15.3706,-1.4353,0,0z" />
          <path
            fill="#FFD700"
            transform="translate(22, -47)"
            d="M0,0C-0.3184,6.2079,-3.4218,10.1753,-7,15C-7.4202,15.5994,-7.8405,16.1988,-8.2734,16.8164C-12.9671,22.9466,-19.5167,26.9903,-26,31C-26.9771,31.6175,-27.9542,32.2349,-28.9609,32.8711C-36.8759,37.2025,-44.0443,37.6875,-52.9587,37.6875C-59.4464,37.7156,-64.889,38.8183,-71,41C-69.6944,30.7649,-63.9514,22.3821,-56,16C-40.0572,4.3895,-19.6735,-0.9519,0,0z" />
          <path
            fill="#FFD700"
            transform="translate(-110, 4)"
            d="M0,0C4.528,2.0065,8.136,4.1229,10.2461,8.707C10.4949,9.4637,10.7437,10.2204,11,11C6.3953,13.6403,2.1915,13.6245,-3,13C-8.9562,11.1832,-12.3948,7.9571,-16,3C-11.2321,-0.9459,-5.8741,-0.9937,0,0z" />
          <!-- Tige et feuille de clémentine d'or -->
          <path
            fill="#006400"
            transform="translate(0, -65)"
            d="M-5,0 C-3,2 -1,4 0,5 C1,4 3,2 5,0 C7,-2 8,-5 5,-7 C3,-8 0,-6 -3,-5 C-5,-4 -7,-2 -5,0 Z" />
          <path
            fill="#8B4513"
            transform="translate(0, -60)"
            d="M-1,0 L1,0 L1,-10 L-1,-10 Z" />
        </g>

        <!-- Clémentines d'argent -->
        <g transform="translate(110, 160) scale(0.25)">
          <path
            fill="#C0C0C0"
            d="M0,0C12.1295,8.255,20.0247,20.5972,23.3125,34.875C25.106,51.6042,21.2011,66.5875,10.6914,79.9336C1.0651,90.2986,-11.7622,95.8209,-25.7659,96.3457C-41.6724,96.5333,-52.7063,91.4923,-64.375,80.75C-73.9585,70.7763,-78.6773,58.1543,-79.125,44.5C-78.7597,28.8408,-72.2041,15.2328,-60.9727,4.4648C-43.5321,-10.1953,-19.3504,-11.2744,0,0z" />
          <path
            fill="#C0C0C0"
            transform="translate(-75, 15)"
            d="M0,0C0.66,0.66,1.32,1.32,2,2C1.6623,2.7012,1.3245,3.4025,0.9766,4.125C-6.477,19.9799,-6.5895,34.4195,-1,51C1.0334,55.5551,3.1053,60.1229,6.6836,63.668C8,65,8,65,8,67C-1.0048,70.8592,-10.9822,71.8157,-20.418,68.9688C-30.1519,64.5274,-37.2013,57.0226,-41,47C-43.5059,39.55,-43.4104,28.0504,-40.25,20.8125C-39.5361,19.521,-38.7892,18.2469,-38,17C-37.4225,15.9688,-36.845,14.9375,-36.25,13.875C-26.3955,1.2832,-15.3706,-1.4353,0,0z" />
          <path
            fill="#C0C0C0"
            transform="translate(22, -47)"
            d="M0,0C-0.3184,6.2079,-3.4218,10.1753,-7,15C-7.4202,15.5994,-7.8405,16.1988,-8.2734,16.8164C-12.9671,22.9466,-19.5167,26.9903,-26,31C-26.9771,31.6175,-27.9542,32.2349,-28.9609,32.8711C-36.8759,37.2025,-44.0443,37.6875,-52.9587,37.6875C-59.4464,37.7156,-64.889,38.8183,-71,41C-69.6944,30.7649,-63.9514,22.3821,-56,16C-40.0572,4.3895,-19.6735,-0.9519,0,0z" />
          <path
            fill="#C0C0C0"
            transform="translate(-110, 4)"
            d="M0,0C4.528,2.0065,8.136,4.1229,10.2461,8.707C10.4949,9.4637,10.7437,10.2204,11,11C6.3953,13.6403,2.1915,13.6245,-3,13C-8.9562,11.1832,-12.3948,7.9571,-16,3C-11.2321,-0.9459,-5.8741,-0.9937,0,0z" />
          <!-- Tige et feuille de clémentine d'argent -->
          <path
            fill="#006400"
            transform="translate(0, -65)"
            d="M-5,0 C-3,2 -1,4 0,5 C1,4 3,2 5,0 C7,-2 8,-5 5,-7 C3,-8 0,-6 -3,-5 C-5,-4 -7,-2 -5,0 Z" />
          <path
            fill="#8B4513"
            transform="translate(0, -60)"
            d="M-1,0 L1,0 L1,-10 L-1,-10 Z" />
        </g>

        <!-- Clémentines de bronze -->
        <g transform="translate(330, 180) scale(0.25)">
          <path
            fill="#CD7F32"
            d="M0,0C12.1295,8.255,20.0247,20.5972,23.3125,34.875C25.106,51.6042,21.2011,66.5875,10.6914,79.9336C1.0651,90.2986,-11.7622,95.8209,-25.7659,96.3457C-41.6724,96.5333,-52.7063,91.4923,-64.375,80.75C-73.9585,70.7763,-78.6773,58.1543,-79.125,44.5C-78.7597,28.8408,-72.2041,15.2328,-60.9727,4.4648C-43.5321,-10.1953,-19.3504,-11.2744,0,0z" />
          <path
            fill="#CD7F32"
            transform="translate(-75, 15)"
            d="M0,0C0.66,0.66,1.32,1.32,2,2C1.6623,2.7012,1.3245,3.4025,0.9766,4.125C-6.477,19.9799,-6.5895,34.4195,-1,51C1.0334,55.5551,3.1053,60.1229,6.6836,63.668C8,65,8,65,8,67C-1.0048,70.8592,-10.9822,71.8157,-20.418,68.9688C-30.1519,64.5274,-37.2013,57.0226,-41,47C-43.5059,39.55,-43.4104,28.0504,-40.25,20.8125C-39.5361,19.521,-38.7892,18.2469,-38,17C-37.4225,15.9688,-36.845,14.9375,-36.25,13.875C-26.3955,1.2832,-15.3706,-1.4353,0,0z" />
          <path
            fill="#CD7F32"
            transform="translate(22, -47)"
            d="M0,0C-0.3184,6.2079,-3.4218,10.1753,-7,15C-7.4202,15.5994,-7.8405,16.1988,-8.2734,16.8164C-12.9671,22.9466,-19.5167,26.9903,-26,31C-26.9771,31.6175,-27.9542,32.2349,-28.9609,32.8711C-36.8759,37.2025,-44.0443,37.6875,-52.9587,37.6875C-59.4464,37.7156,-64.889,38.8183,-71,41C-69.6944,30.7649,-63.9514,22.3821,-56,16C-40.0572,4.3895,-19.6735,-0.9519,0,0z" />
          <path
            fill="#CD7F32"
            transform="translate(-110, 4)"
            d="M0,0C4.528,2.0065,8.136,4.1229,10.2461,8.707C10.4949,9.4637,10.7437,10.2204,11,11C6.3953,13.6403,2.1915,13.6245,-3,13C-8.9562,11.1832,-12.3948,7.9571,-16,3C-11.2321,-0.9459,-5.8741,-0.9937,0,0z" />
          <!-- Tige et feuille de clémentine de bronze -->
          <path
            fill="#006400"
            transform="translate(0, -65)"
            d="M-5,0 C-3,2 -1,4 0,5 C1,4 3,2 5,0 C7,-2 8,-5 5,-7 C3,-8 0,-6 -3,-5 C-5,-4 -7,-2 -5,0 Z" />
          <path
            fill="#8B4513"
            transform="translate(0, -60)"
            d="M-1,0 L1,0 L1,-10 L-1,-10 Z" />
        </g>

        <!-- Petite trophée sur le podium doré -->
        <g transform="translate(250, 155)">
          <path
            d="M-12,-15 L12,-15 L10,-5 L-10,-5 Z"
            fill="#FFD700"
            stroke="#CC9900"
            stroke-width="1" />
          <rect
            x="-3"
            y="-5"
            width="6"
            height="10"
            fill="#FFD700"
            stroke="#CC9900"
            stroke-width="1" />
          <ellipse
            cx="0"
            cy="5"
            rx="8"
            ry="2"
            fill="#FFD700"
            stroke="#CC9900"
            stroke-width="0.5" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.podium {
  position: fixed;
  right: 0;
  bottom: 0;
  background-color: rgb(239, 133, 77);
  opacity: 0.4;
  width: 20vh;
  height: 20vh;
  border-radius: 50% 50% 0;
  display: flex;
  align-items: center;
  transition: 500ms;
}

.podium:hover {
  width: 50vh;
  height: 50vh;
}

.podium:hover {
  cursor: pointer;
  opacity: 1;
  transition: 500ms;
}

.podium div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.podium svg {
  width: 90%;
  height: 90%;
}
</style>
