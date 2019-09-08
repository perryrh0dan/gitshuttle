import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'RepoFilter'
})

export class RepoFilterPipe implements PipeTransform {
  transform(repos: any, query: string): any {
    console.log(repos); //this shows in the console
    console.log(query); //this does not show anything in the console when typing
    if(!query) {
      return repos;
    }
    return repos.filter((repo) => {
      return repo.name.toLowerCase().match(query.toLowerCase());
    });
  }
}