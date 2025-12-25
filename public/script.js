async function loadFamily() {
  const res = await fetch('/api/family');
  const data = await res.json();

  let mermaidCode = 'flowchart TD\n';
  const peopleMap = {};
  const parentsMap = {};

  function buildTree(person, parentId = null) {
    const id = person.name.replace(/\s+/g, '_');
    const label = `${person.name}\\n${person.isAlive ? '🟢 Alive' : '🔴 Deceased'}\\n${person.dob}${person.dateOfDeath ? ' - ' + person.dateOfDeath : ''}`;
    peopleMap[id] = person;

    mermaidCode += `    ${id}["${label}"]\n`;
    if (parentId) {
      mermaidCode += `    ${parentId} --> ${id}\n`;
      parentsMap[id] = parentId;
    }

    mermaidCode += `    click ${id} call showPerson("${id}") "Click for details"\n`;

    if (person.children && person.children.length > 0) {
      person.children.forEach(child => buildTree(child, id));
    }
  }

  if (Array.isArray(data)) data.forEach(root => buildTree(root));
  else buildTree(data);

  const container = document.getElementById('mermaid-container');
  container.textContent = mermaidCode;

  window.familyData = peopleMap;
  window.familyParents = parentsMap;

  window.mermaid.initialize({
    startOnLoad: true,
    theme: "neutral",
    flowchart: { curve: "basis" },
    securityLevel: "loose"
  });
  window.mermaid.init(undefined, container);
}

// Show person details in modal
window.showPerson = function (id) {
  const person = window.familyData[id];
  const parentId = window.familyParents[id];
  if (!person) return;

  const modal = document.getElementById('person-modal');
  modal.querySelector('h2').textContent = person.name;
  modal.querySelector('.details').innerHTML = `
    <img src="${person.picture}" alt="${person.name}">
    <p><b>DOB:</b> ${person.dob}</p>
    <p><b>Spouse:</b> ${person.spouse || 'N/A'}</p>
    <p><b>Status:</b> ${person.isAlive ? '🟢 Alive' : `🔴 Deceased (${person.dateOfDeath || 'N/A'})`}</p>
  `;

  let relationsHTML = '';

  if (parentId) {
    const parent = window.familyData[parentId];
    relationsHTML += `<p><b>Parent:</b> <a href="#" onclick="showPerson('${parentId}')">${parent.name}</a></p>`;
  }

  if (person.children && person.children.length > 0) {
    const childrenLinks = person.children
      .map(c => `<a href="#" onclick="showPerson('${c.name.replace(/\s+/g, '_')}')">${c.name}</a>`)
      .join(', ');
    relationsHTML += `<p><b>Children:</b> ${childrenLinks}</p>`;
  }

  modal.querySelector('.relations').innerHTML = relationsHTML;
  modal.style.display = 'flex';
};

window.closeModal = function () {
  document.getElementById('person-modal').style.display = 'none';
};

loadFamily();
