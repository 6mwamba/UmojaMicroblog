import { loadStdlib, ask } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = await loadStdlib();

const isBlogOwner = await ask.ask(
  `Are you the Blogger?`,
  ask.yesno
 );
const who = isBlogOwner ? 'Blogger' : 'Subscriber';

console.log(`You're using the Microblog as a ${who}`);

let acc = null;
const createAcc = await ask.ask(
  `Would you like to create an account? (only possible on devnet)`,
  ask.yesno
);
if (createAcc) {
  acc = await stdlib.newTestAccount(stdlib.parseCurrency(100));
} else {
  const secret = await ask.ask(
    `What is your account secret?`,
    (x => x)
  );
  acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
 if (isBlogOwner) {
  ctc = acc.contract(backend);

  
  const nameOfStream = await ask.ask(
      `Name of the stream you would like to create?`,
      (name => name)
    );
 
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`); });
} else {
  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
}

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));

const before = await getBalance();
//console.log(`Your balance is ${before}`);

const interact = { ...stdlib.hasRandom };

interact.informTimeout = () => {
  console.log(`There was a timeout.`);
  process.exit(1);
};





if(isBlogOwner){
  interact.stream = async () => {
    const post = await ask.ask(
      `Create your post:`,
      (thought => thought)
    );
    return post
  };
}
else{
  interact.got = async (stream) => {
    console.log(`New Post by ${stream.owner}\n${stream.content}`)
  };
}

if(isBlogOwner){
  interact.resume = async () => {
    const resumeOrNot = await ask.ask(
      `Do you wish to continue posting to the stream?`,
      ask.yesno
    );
    if (resumeOrNot) {
      return 0;
    } else {
      return 1;
    }
  };
}

interact.quitBlog = async () => {
  console.log(`Stream has ended`);
};
  
const part = isBlogOwner ? backend.Blogger : backend.Subscriber;
await part(ctc, interact);

ask.done();
