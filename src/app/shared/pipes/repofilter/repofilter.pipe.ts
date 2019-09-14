import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'RepoFilter'
})

export class RepoFilterPipe implements PipeTransform {
  transform(repos: any, query: string): any {
    if (!query) {
      return repos;
    }
    return repos.filter((repo) => {
      return repo.name.toLowerCase().match(query.toLowerCase());
    });
  }
}
