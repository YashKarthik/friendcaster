import got from "got";
import { getDirectory, getAvatarListUrl, getAvatarUrl } from './api';

interface IAction {

  body: Object;
  merkleRoot: string;
  signature: string;
  meta: {
    displayName: string;
    avatar: string;
    isVerifiedAvatar: boolean;
    numReplyChildren: number;
    reactions: Object;
    recasts: Object;
    watches: Object;
    replyParentUsername: {
      address: string;
      username: string;
    }
  }

}

/*
 * Traverses over the user's timeline and return the usernames whom the user has replied to.
 * If a cast is a reply, it will have the `replyParentUsername` property.
 * @return {string[]}    an array of users whose post the user has replied to.
 */
export const getRepliedUsernames = async (username: string, registryContract:any): Promise<string[]>  => {
  const { directoryBody } = await getDirectory(username, registryContract);
  const addressActivityResponse = await got(directoryBody.addressActivityUrl);
  const addressActivity: IAction[] = JSON.parse(addressActivityResponse.body);

  const repliedPeople: string[] = addressActivity.filter((action:IAction) => {
    // check if the action is a associated with another user.
    if (!action.meta.replyParentUsername) {
      return false;
    }

    return true;
  }).map((action:any) => action.meta.replyParentUsername.username)

  return repliedPeople;
}


interface IFreqObj {
  string: number;
}

export interface INameFreq {
  username: string;
  freq: number;
  avatarUrl?: string;
}

/*
 * If a user already exists in the object, increment the count.
 * Otherwise create a new index for the user and set the count to 1
 * @returns {object { string: number }}    an object of users whose post the user has replied to.
 * @todo currently only supports replie, later will figure out recasts and likes.
 */

export const getInteractionFrequency = async (username: string, registryContract:any): Promise<INameFreq[][]>  => {
  const interactedPeople = await getRepliedUsernames(username, registryContract);

  const interactionFrequency: IFreqObj = interactedPeople.reduce((prevValue: any, currentValue: string) => {
    return prevValue[currentValue] ? ++prevValue[currentValue] : prevValue[currentValue] = 1, prevValue
  }, {});

  const tally: INameFreq[] | any[] = []
  for (const [uname, freq] of Object.entries(interactionFrequency)) {
	tally.push({
      username: uname,
      freq: freq
	});
  }

  tally.sort((a:any, b:any) => b.freq - a.freq);
  let head: INameFreq[] = tally.slice(0, 49);

  const usernames = head.map(u => u.username);

  const avatarUrlList = await getAvatarListUrl(usernames, registryContract);
  for (const i of head) {
    i.avatarUrl = avatarUrlList[i.username];
  }

  const userUrl = await getAvatarUrl(username, registryContract);

  head = [{username: username, freq: 0, avatarUrl: userUrl}, ...head];

  let result: INameFreq[][] = []
  result.push(head.splice(0, 1))
  result.push(head.splice(0, 8))
  result.push(head.splice(0, 15))
  result.push(head.splice(0, 26))
  return result;
}
