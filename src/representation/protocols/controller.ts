import {HttpRequest, HttpResponse} from '../protocols'


export interface Controller{
    handle(httpRequest: HttpRequest): HttpResponse

}