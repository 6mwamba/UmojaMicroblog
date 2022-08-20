'reach 0.1';

const [ state, ON,   OFF] = makeEnum(2);

const common = {
  quitBlog: Fun([], Null)
}


export const main = Reach.App(() => {

  const Blogger = Participant('Blogger', {
    ...common,
    stream: Fun([], Bytes(512)),
    streamName: Fun([], Bytes(32)),
    resume: Fun([], UInt),
  });
  const Subscriber   = ParticipantClass('Subscriber', {
    ...common,
    got: Fun([Object({
      content: Bytes(512),
      owner: Address
    })], Null)

  });
  init();


  Blogger.publish();
  var newState = ON;

  invariant(balance() == 0);
  while (newState == ON) {
    commit();

    Blogger.only(() => {
      const stream = declassify(interact.stream());
      const owner = this
    });
    Blogger.publish(stream, owner);
    commit();

    Subscriber.interact.got({
      content: stream,
      owner: owner
    });
    Blogger.only(() => {
      const done = declassify(interact.resume()); 
    })
    Blogger.publish(done);
    newState = done;
    continue;
  }

  commit();
  each([Blogger, Subscriber],() => {interact.quitBlog()}); 

  exit();

    
}
);

    

