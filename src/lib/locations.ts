/**
 * lib/locations.ts
 * Massive Romanian cities database for Programmatic SEO.
 */

export const TOP_CITIES = [
  "București", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", 
  "Galați", "Ploiești", "Oradea", "Brăila", "Arad", "Pitești", "Sibiu", "Bacău", 
  "Târgu Mureș", "Baia Mare", "Buzău", "Botoșani", "Satu Mare", "Râmnicu Vâlcea", 
  "Drobeta-Turnu Severin", "Suceava", "Piatra Neamț", "Târgu Jiu", "Târgoviște", 
  "Focșani", "Bistrița", "Reșița", "Tulcea", "Slatina", "Călărași", "Giurgiu", 
  "Alba Iulia", "Deva", "Hunedoara", "Zalău", "Sfântu Gheorghe", "Bârlad", "Vaslui", 
  "Roman", "Turda", "Mediaș", "Slobozia", "Alexandria", "Voluntari", "Lugoj", "Medgidia", 
  "Onești", "Miercurea Ciuc", "Sighetu Marmației", "Petroșani", "Mangalia", "Tecuci", 
  "Odorheiu Secuiesc", "Pașcani", "Dej", "Reghin", "Năvodari", "Câmpina", "Mioveni", 
  "Câmpulung", "Caracal", "Săcele", "Făgăraș", "Fetești", "Sighișoara", "Borșa", 
  "Roșiori de Vede", "Curtea de Argeș", "Sebeș", "Huși", "Fălticeni", "Pantelimon", 
  "Oltenița", "Turnu Măgurele", "Caransebeș", "Dorohoi", "Vulcan", "Rădăuți", 
  "Zărnești", "Lupeni", "Aiud", "Petrila", "Câmpulung Moldovenesc", "Buftea", 
  "Târnăveni", "Popești-Leordeni", "Moinești", "Codlea", "Cugir", "Carei", "Gherla", 
  "Blaj", "Comănești", "Motru", "Târgu Neamț", "Moreni", "Târgu Secuiesc", 
  "Gheorgheni", "Băicoi", "Orăștie", "Salonta", "Băilești", "Calafat", "Cernavodă", 
  "Filiași", "Câmpeni", "Beiuș", "Marghita", "Săcueni", "Valea lui Mihai", "Ștei", 
  "Aleșd", "Bistrița", "Năsăud", "Sângeorz-Băi", "Beclean", "Botoșani", "Dorohoi", 
  "Darabani", "Săveni", "Flămânzi", "Bucecea", "Ștefănești", "Brașov", "Făgăraș", 
  "Săcele", "Zărnești", "Codlea", "Râșnov", "Victoria", "Rupea", "Ghimbav", "Predeal", 
  "Brăila", "Ianca", "Însurăței", "Făurei", "Buzău", "Râmnicu Sărat", "Nehoiu", 
  "Pătârlagele", "Pogoanele", "Călărași", "Oltenița", "Budești", "Fundulea", "Lehliu Gară", 
  "Caraș-Severin", "Reșița", "Caransebeș", "Bocșa", "Oravița", "Moldova Nouă", 
  "Oțelu Roșu", "Anina", "Băile Herculane", "Cluj", "Cluj-Napoca", "Turda", "Dej", 
  "Câmpia Turzii", "Gherla", "Huedin", "Constanța", "Mangalia", "Medgidia", "Năvodari", 
  "Cernavodă", "Ovidiu", "Murfatlar", "Hârșova", "Eforie", "Techirghiol", "Băneasa", 
  "Negru Vodă", "Covasna", "Sfântu Gheorghe", "Târgu Secuiesc", "Covasna", "Baraolt", 
  "Întorsura Buzăului", "Dâmbovița", "Târgoviște", "Moreni", "Pucioasa", "Găești", 
  "Titu", "Fieni", "Răcari", "Dolj", "Craiova", "Băilești", "Calafat", "Filiași", 
  "Dăbuleni", "Segarcea", "Bechet", "Galați", "Tecuci", "Târgu Bujor", "Berești", 
  "Giurgiu", "Bolintin-Vale", "Mihăilești", "Gorj", "Târgu Jiu", "Motru", "Rovinari", 
  "Bumbești-Jiu", "Târgu Cărbunești", "Turceni", "Tismana", "Novaci", "Țicleni", 
  "Harghita", "Miercurea Ciuc", "Odorheiu Secuiesc", "Gheorgheni", "Toplița", 
  "Cristuru Secuiesc", "Vlăhița", "Bălan", "Borsec", "Băile Tușnad", "Hunedoara", 
  "Deva", "Hunedoara", "Petroșani", "Vulcan", "Lupeni", "Petrila", "Orăștie", "Brad", 
  "Simeria", "Călan", "Hațeg", "Uricani", "Geoagiu", "Aninoasa", "Ialomița", "Slobozia", 
  "Fetești", "Urziceni", "Țăndărei", "Amara", "Căzănești", "Fierbinți-Târg", "Iași", 
  "Pașcani", "Hârlău", "Târgu Frumos", "Podu Iloaiei", "Ilfov", "Voluntari", 
  "Pantelimon", "Buftea", "Popești-Leordeni", "Bragadiru", "Chitila", "Otopeni", 
  "Măgurele", "Maramureș", "Baia Mare", "Sighetu Marmației", "Borșa", "Baia Sprie", 
  "Vișeu de Sus", "Târgu Lăpuș", "Seini", "Somcuta Mare", "Ulmeni", "Tăuții-Măgherăuș", 
  "Cavnic", "Săliștea de Sus", "Dragomirești", "Mehedinți", "Drobeta-Turnu Severin", 
  "Orșova", "Strehaia", "Baia de Aramă", "Vânju Mare", "Mureș", "Târgu Mureș", "Reghin", 
  "Sighișoara", "Târnăveni", "Luduș", "Sovata", "Iernut", "Sărmașu", "Ungheni", 
  "Miercurea Nirajului", "Sângeorgiu de Pădure", "Neamț", "Piatra Neamț", "Roman", 
  "Târgu Neamț", "Bicaz", "Roznov", "Olt", "Slatina", "Caracal", "Balș", "Corabia", 
  "Drăgănești-Olt", "Piatra-Olt", "Scornicești", "Potcoava", "Prahova", "Ploiești", 
  "Câmpina", "Băicoi", "Breaza", "Mizil", "Comarnic", "Vălenii de Munte", "Boldești-Scăeni", 
  "Urlați", "Sinaia", "Bușteni", "Plopeni", "Slănic", "Azuga", "Satu Mare", "Carei", 
  "Negrești-Oaș", "Tășnad", "Livada", "Ardud", "Sălaj", "Zalău", "Șimleu Silvaniei", 
  "Jibou", "Cehu Silvaniei", "Sibiu", "Mediaș", "Cisnădie", "Avrig", "Agnita", 
  "Dumbrăveni", "Tălmaciu", "Copșa Mică", "Săliște", "Băile Govora", "Băile Olănești",
  "Ocna Sibiului", "Miercurea Sibiului", "Suceava", "Fălticeni", "Rădăuți", "Câmpulung Moldovenesc",
  "Vatra Dornei", "Vicovu de Sus", "Gura Humorului", "Marginea", "Salcea", "Broșteni"
];

export function slugify(text: string): string {
  return text.toString().toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getRandomCity(seed?: string) {
  if (!seed) return TOP_CITIES[Math.floor(Math.random() * TOP_CITIES.length)];
  
  // Use a simple hash based on seed (like SKU) to always pick the same city for the same product
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return TOP_CITIES[Math.abs(hash) % TOP_CITIES.length];
}
