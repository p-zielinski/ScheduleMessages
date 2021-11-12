const replaceMyName = (theMessage, currentName, nameAtAMomentOfScheduling) => {
  const findFunctions = (e) => {
    let ar = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] == "<" || e[i] == ">") {
        ar.push([e[i], i]);
      }
    }
    return ar;
  };

  const f = findFunctions(theMessage);
  let errors = {};
  const replace = [];

  i = 0;
  while (i < f.length) {
    //looking for functions
    if (f[i][0] === ">") {
      try {
        if (f[i - 1][0] === "<") {
          const sliced = theMessage.slice(f[i - 1][1], f[i][1] + 1);
          const slicedToLowerCase = sliced
            .toLowerCase()
            .replace(/\n/g, "")
            .replace(/\ /g, ""); //part inside { ... }
          if (
            slicedToLowerCase.includes("<my") ||
            slicedToLowerCase.match(/<\Wmy/) !== null
          ) {
            if (slicedToLowerCase.includes("now")) {
              replace.push([sliced, nameAtAMomentOfScheduling]);
            } else {
              if (currentName.length < 2) {
                replace.push([sliced, nameAtAMomentOfScheduling]);
              } else {
                replace.push([sliced, currentName]);
              }
            }
          }
          i++;
        }
      } catch (error) {
        console.log(error);
        i++;
      }
    } else {
      i++;
    }
  }

  replace.forEach((e) => {
    theMessage = theMessage.replace(new RegExp(e[0], "i"), " " + e[1] + " ");
  });
  return theMessage;
};

module.exports = replaceMyName;
