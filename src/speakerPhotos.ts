import academicCenter from './assets/Organizadores/CAseminfo.jpeg';
import douglas from './assets/Organizadores/douglas.jpeg';
import ana from './assets/Organizadores/ana.jpeg';
import ricardo from './assets/Organizadores/ricardo.jpeg';
import tiago from './assets/Organizadores/tiago.jpeg';
import caio from './assets/Organizadores/caio.jpeg';
import gabriel from './assets/Organizadores/darosa.jpeg';
import rafaela from './assets/Organizadores/rafaela.jpeg';
import felipe from './assets/Organizadores/felipe.jpeg';
import abreu from './assets/Organizadores/abreu.jpeg';
import nycollas from './assets/Organizadores/nycollas.jpeg';
import daniele from './assets/Organizadores/daniele.jpeg';
import johnatan from './assets/Organizadores/johnatan.jpg';

const photos: Record<string, string> = {
  'Centro Acadêmico Alan Turing': academicCenter,
  'Prof. Dr. Douglas Donizeti de Castilho Braz': douglas,
  'Ana Carolina Brazão': ana,
  'Ricardo Martins': ricardo,
  'Tiago Fernandes Moraes': tiago,
  'Caio Henrique de Almeida Magalhães': caio,
  'Gabriel Darosa': gabriel,
  'Rafaela Alves Magalhães': rafaela,
  'Felipe Antony Baquião Avelar': felipe,
  'Prof. Dr. Guilherme Prado Roitberg (Coordenador), Alisson Gabriel Reis Carmo (bolsista), Nicoly Elisa de Oliveira Souza (bolsista).': abreu,
  'Nycollas Icrad Luz Machado': nycollas,
  'Daniele Tavares': daniele,
  'Johnatan Alves de Oliveira': johnatan,
};

export function speakerPhoto(name: string) {
  return photos[name.trim()];
}
