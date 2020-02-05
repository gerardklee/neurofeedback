import { epoch, fft, alphaPower } from "@neurosity/pipes";

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