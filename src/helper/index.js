export default repos => {
  const languages = repos
    .filter(l => l.primaryLanguage && l.defaultBranchRef)
    .map(l => {
      const { name: language, color } = l.primaryLanguage;
      let loc = 0;
      for (const item of l.defaultBranchRef.target.history.nodes) {
        loc += item.additions;
        loc -= item.deletions;
      }
      return {
        language,
        loc,
        color
      };
    });
  let langDictionnary = {};
  let total = 0;
  for (const lang of languages) {
    const nb = langDictionnary[lang.language] || 0;
    langDictionnary[lang.language] = nb + lang["loc"];
    total += lang["loc"];
  }

  return { langDictionnary, total, languages };
};
