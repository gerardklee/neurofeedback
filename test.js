import { averagePower } from "@neurosity/pipes/src/pipes/frequency/averagePower.js"

function main() {
  eeg$
  .pipe(
    epoch({ duration: 256, interval: 100 }),
    fft({ bins: 256 }),
    alphaPower()
  )
  .subscribe(alphaPower => console.log(alphaPower));
}

main()