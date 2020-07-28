const content = {
  inputForm: `<div>
  <div class="form-group row">
    <label for="id" class="col-sm-2 col-form-label">id</label>
    <div class="col-sm-10">
      <input type="text" name="id" class="form-control" id="id" placeholder="id">
    </div>
  </div>
  <div class="form-group row">
    <label for="firstName" class="col-sm-2 col-form-label">firstName</label>
    <div class="col-sm-10">
      <input type="text" name="firstName" class="form-control" id="firstName" placeholder="firstName">
    </div>
  </div>
  <div class="form-group row">
  <label for="lastName" class="col-sm-2 col-form-label">lastName</label>
  <div class="col-sm-10">
    <input type="text" name="lastName" class="form-control" id="lastName" placeholder="lastName">
  </div>
  </div>
  <div class="form-group row">
    <label for="email" class="col-sm-2 col-form-label">email</label>
    <div class="col-sm-10">
      <input type="text" name="email" class="form-control" id="email" placeholder="email">
    </div>
    </div>
    <div class="form-group row">
      <label for="phone" class="col-sm-2 col-form-label">phone</label>
      <div class="col-sm-10">
        <input type="text" name="phone" class="form-control" id="phone" placeholder="phone">
      </div>
    </div>
    <button type="submit" disabled data-role="addTable" class="btn btn-primary">Add to table</button>
</div>`,
  addButton: '<button type="submit" data-role="add" class="btn btn-primary">Add</button>',
};

module.exports = content;
