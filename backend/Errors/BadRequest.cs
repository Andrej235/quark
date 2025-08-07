using FluentResults;

namespace Quark.Errors;

public class BadRequest(string message) : Error(message) { }
